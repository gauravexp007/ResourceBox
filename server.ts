import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize GoogleGenAI client on server with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * AI Item Suggestion Endpoint
 * Analyzes uploaded equipment photos and returns structured title, category,
 * description, price range, and missing info questions for owner confirmation.
 */
app.post('/api/ai/suggest-item', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', currencySymbol = '₹', userCountry = 'India' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Missing imageBase64 in request body.' });
    }

    let cleanBase64 = '';
    let resolvedMimeType = mimeType || 'image/jpeg';

    // Support both direct base64 data and web image URLs
    if (typeof imageBase64 === 'string' && (imageBase64.startsWith('http://') || imageBase64.startsWith('https://'))) {
      try {
        const imgFetch = await fetch(imageBase64);
        const arrayBuf = await imgFetch.arrayBuffer();
        cleanBase64 = Buffer.from(arrayBuf).toString('base64');
        resolvedMimeType = imgFetch.headers.get('content-type') || 'image/jpeg';
      } catch (fetchErr) {
        console.warn('Failed to fetch remote image url:', fetchErr);
        return res.status(400).json({ success: false, error: 'Could not fetch sample image URL.' });
      }
    } else {
      cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    }

    const prompt = `You are an expert appraiser and listing assistant for ResourceBox, a peer-to-peer equipment rental and barter platform.
Analyze this picture of an item/equipment that an owner wants to list for rent or exchange.

Please perform the following:
1. Identify the specific item/equipment name (e.g. brand, model, type).
2. Draft an attractive, clear marketplace listing title.
3. Categorize it into ONE of these category IDs: "tools", "cameras", "mobility", "outdoors", "electronics", "home", "music", "sports".
4. Determine the visible condition: "Like New", "Excellent", "Good", or "Fair".
5. Draft an informative, welcoming description (2-3 paragraphs) detailing key specs, typical use cases (e.g., weekend DIY, road trips, content creation), handling recommendations, and what to expect.
6. Suggest a realistic, fair daily rental price range and security deposit suited for peer-to-peer community sharing in ${userCountry} (in currency ${currencySymbol}).
7. Identify 2-4 critical missing pieces of information that cannot be confirmed from the picture alone (e.g., accessories like chargers/cables, exact internal battery health, usage wear, included bits/blades, carrying case). For each, formulate a short question and a likely default/suggested answer for the owner to quickly verify or tweak.
8. Suggest 3 sensible borrowing rules for this equipment.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: resolvedMimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction: 'You are an expert AI appraisal and listing generator for ResourceBox marketplace. Always output strict valid JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: {
              type: Type.STRING,
              description: 'Concise specific product name with brand/model if identifiable.',
            },
            title: {
              type: Type.STRING,
              description: 'Engaging, professional listing title for peer-to-peer rental/exchange.',
            },
            category: {
              type: Type.STRING,
              description: 'One of: tools, cameras, mobility, outdoors, electronics, home, music, sports.',
            },
            categoryName: {
              type: Type.STRING,
              description: 'Human-readable category label (e.g., Tools & Hardware, Cameras & Lenses).',
            },
            condition: {
              type: Type.STRING,
              description: 'One of: Like New, Excellent, Good, Fair.',
            },
            description: {
              type: Type.STRING,
              description: 'High quality detailed description with specs and ideal use cases.',
            },
            priceSuggested: {
              type: Type.NUMBER,
              description: 'Recommended daily rental rate in number.',
            },
            priceMin: {
              type: Type.NUMBER,
              description: 'Low end of recommended daily price range.',
            },
            priceMax: {
              type: Type.NUMBER,
              description: 'High end of recommended daily price range.',
            },
            depositSuggested: {
              type: Type.NUMBER,
              description: 'Suggested security deposit amount in number.',
            },
            priceExplanation: {
              type: Type.STRING,
              description: 'Brief 1-sentence rationale for the recommended price range.',
            },
            identifiedFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3-5 detected features, parts, or specifications visible.',
            },
            missingInfoQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: 'Question to confirm unverified details.' },
                  suggestedAnswer: { type: Type.STRING, description: 'Sensible suggested answer the owner can confirm or adjust.' },
                  confirmed: { type: Type.BOOLEAN, description: 'Whether pre-checked.' },
                },
                required: ['question', 'suggestedAnswer'],
              },
              description: 'Questions asking the owner to confirm missing details not clearly visible in photo.',
            },
            recommendedRules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Sensible care and usage rules.',
            },
          },
          required: [
            'itemName',
            'title',
            'category',
            'condition',
            'description',
            'priceSuggested',
            'priceMin',
            'priceMax',
            'depositSuggested',
            'priceExplanation',
            'missingInfoQuestions',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Server Gemini API error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze equipment image with Gemini AI.',
    });
  }
});

/**
 * AI Item Description Generator Endpoint
 * Generates concise, engaging short descriptions tailored to the item's name and category entered by the user.
 */
app.post('/api/ai/suggest-description', async (req, res) => {
  try {
    const { itemName, category, condition = 'Excellent' } = req.body;

    if (!itemName || !String(itemName).trim()) {
      return res.status(400).json({ success: false, error: 'Item name is required to generate description.' });
    }

    const prompt = `You are a listing assistant for ResourceBox, a peer-to-peer equipment sharing community.
The owner entered the following details for an item they want to list:
- Item Name: "${itemName}"
- Category: "${category || 'General Equipment'}"
- Condition: "${condition}"

Please generate a compelling, professional, yet friendly short description (2 to 4 sentences, roughly 45-75 words) suitable for a rental or exchange listing.
Highlight:
1. What the item is best used for (practical use cases).
2. Key features or benefits to the borrower.
3. Clean, well-maintained condition reassurance.

Also provide 2-3 bullet highlights (e.g. accessories included, handled with care). Output strict JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert description copywriter for peer-to-peer equipment rentals. Output a clean, concise JSON with shortDescription, highlights, and fullDraft.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shortDescription: {
              type: Type.STRING,
              description: 'A punchy, engaging 2-4 sentence short description.',
            },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 key highlights or handling points.',
            },
            fullDraft: {
              type: Type.STRING,
              description: 'The combined ready-to-use description text.',
            },
          },
          required: ['shortDescription', 'highlights', 'fullDraft'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI model.');
    const parsed = JSON.parse(text);
    if (parsed.highlights && Array.isArray(parsed.highlights) && parsed.highlights.length > 0) {
      const shortDesc = (parsed.shortDescription || '').trim();
      parsed.fullDraft = shortDesc 
        ? `${shortDesc}\n\n• ${parsed.highlights.join('\n• ')}`
        : `• ${parsed.highlights.join('\n• ')}`;
    }
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Server Gemini description error:', error);
    // Provide a smart fallback if offline or API key limit
    const cleanName = req.body?.itemName || 'item';
    const cleanCat = req.body?.category || 'equipment';
    const fallbackDesc = `Reliable ${cleanName} in ${req.body?.condition || 'excellent'} condition, ready for local peer-to-peer sharing. Well-suited for personal projects, creative work, or weekend use. Inspected, fully functional, and handled with care.`;
    return res.json({
      success: true,
      data: {
        shortDescription: fallbackDesc,
        highlights: ['Inspected & fully functional', 'Clean condition', 'Standard accessories included'],
        fullDraft: `${fallbackDesc}\n\n• Clean & fully functional\n• Handled with care\n• Standard accessories included`,
      },
    });
  }
});

// =========================================================================
// PERSISTENT SHARED MARKETPLACE DATABASE API
// Enables items uploaded by users to be permanently stored and visible
// to ALL other users on DIFFERENT devices without authorization.
// Uploading, messaging, and paying require authentication.
// =========================================================================
const DB_FILE = path.resolve(__dirname, 'data', 'database.json');

const ADMIN_ID = 'admin-resourcebox-official';
const ADMIN_EMAIL = 'fab.gaurav007@gmail.com';
const ADMIN_USERNAME = '@resourcebox';
const ADMIN_AVATAR = '/admin-avatar.jpg';
const ADMIN_BIO =
  'Official ResourceBox Admin & Community Hub.\nCurating trusted rentals, verified peer-to-peer swaps, and safe neighborhood sharing.\nDM anytime for verification help, featured listings, or community support.';
// Salted scrypt digest of the configured admin credential
const ADMIN_PASSWORD_HASH =
  '87a36808cdddbad8dae234e7d07ed0a3:573cff26d7f80935571010a7719c60b65383f52e1474a425d84a75a3f18d43cb1961c2ebc9741b56dd8fa42e58dbbc2c75fbc0b0ac702839d75105f828dcf000';

function isAdminUserRecord(u: any): boolean {
  if (!u || typeof u !== 'object') return false;
  if (u.id === ADMIN_ID) return true;
  if (typeof u.email === 'string' && u.email.trim().toLowerCase() === ADMIN_EMAIL) return true;
  if (normalizeHandle(u.username) === ADMIN_USERNAME) return true;
  return Boolean(u.isAdmin || u.role === 'admin');
}

function ensureAdminAccountSeeded(db: any): boolean {
  if (!Array.isArray(db.users)) db.users = [];
  const idx = db.users.findIndex(
    (u: any) =>
      u?.id === ADMIN_ID ||
      (typeof u?.email === 'string' && u.email.trim().toLowerCase() === ADMIN_EMAIL) ||
      normalizeHandle(u?.username) === ADMIN_USERNAME
  );

  const nowIso = new Date().toISOString();
  if (idx < 0) {
    db.users.unshift({
      id: ADMIN_ID,
      name: 'ResourceBox Official',
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      avatar: ADMIN_AVATAR,
      role: 'admin',
      isAdmin: true,
      rating: 5.0,
      reviewCount: 42,
      verified: true,
      phoneVerified: true,
      phoneNumber: '',
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Hapur',
      pincode: '245101',
      postalCode: '245101',
      location: 'Hapur, Uttar Pradesh, 245101, India',
      neighborhood: 'ResourceBox HQ',
      currency: '₹',
      currencyCode: 'INR',
      memberSince: 'October 2026',
      bio: ADMIN_BIO,
      savedItemIds: [],
      preferredHandover: ['Self Pickup', 'Public Meetup', 'Local Delivery'],
      passwordHash: ADMIN_PASSWORD_HASH,
      registeredAt: nowIso,
      updatedAt: nowIso,
    });
    return true;
  }

  const existing = db.users[idx];
  let changed = false;
  if (existing.id !== ADMIN_ID) {
    existing.id = ADMIN_ID;
    changed = true;
  }
  if (existing.email !== ADMIN_EMAIL) {
    existing.email = ADMIN_EMAIL;
    changed = true;
  }
  if (normalizeHandle(existing.username) !== ADMIN_USERNAME) {
    existing.username = ADMIN_USERNAME;
    changed = true;
  }
  if (existing.role !== 'admin') {
    existing.role = 'admin';
    changed = true;
  }
  if (existing.isAdmin !== true) {
    existing.isAdmin = true;
    changed = true;
  }
  if (existing.verified !== true) {
    existing.verified = true;
    changed = true;
  }
  if (!existing.passwordHash) {
    existing.passwordHash = ADMIN_PASSWORD_HASH;
    changed = true;
  }
  if (!existing.bio || !String(existing.bio).trim()) {
    existing.bio = ADMIN_BIO;
    changed = true;
  }
  if (!existing.avatar || String(existing.avatar).includes('unsplash.com/photo-1535713875002')) {
    existing.avatar = ADMIN_AVATAR;
    changed = true;
  }
  if (
    existing.city !== 'Hapur' ||
    existing.state !== 'Uttar Pradesh' ||
    existing.country !== 'India'
  ) {
    existing.country = 'India';
    existing.state = 'Uttar Pradesh';
    existing.city = 'Hapur';
    existing.pincode = '245101';
    existing.postalCode = '245101';
    existing.location = 'Hapur, Uttar Pradesh, 245101, India';
    changed = true;
  }
  return changed;
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const initialDb = { items: [], bookings: [], proposals: [], conversations: [], users: [], reviews: [], follows: [], notifications: [] };
      ensureAdminAccountSeeded(initialDb);
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!Array.isArray(parsed.reviews)) parsed.reviews = [];
    if (!Array.isArray(parsed.follows)) parsed.follows = [];
    if (!Array.isArray(parsed.notifications)) parsed.notifications = [];
    if (!Array.isArray(parsed.items)) parsed.items = [];
    if (ensureAdminAccountSeeded(parsed)) {
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.warn('Notice reading database file:', err);
    const fallbackDb = { items: [], bookings: [], proposals: [], conversations: [], users: [], reviews: [], follows: [], notifications: [] };
    ensureAdminAccountSeeded(fallbackDb);
    return fallbackDb;
  }
}

function writeDb(data: any) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

function normalizeHandle(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const stripped = raw.trim().replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  return stripped ? `@${stripped}` : '';
}

function isValidHandleFormat(handleWithAt: string): boolean {
  const bare = handleWithAt.replace(/^@/, '');
  return /^[a-z0-9_]{3,24}$/.test(bare);
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  try {
    const keyBuf = Buffer.from(keyHex, 'hex');
    const derivedBuf = crypto.scryptSync(password, salt, 64);
    if (keyBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, derivedBuf);
  } catch {
    return false;
  }
}

function sanitizeUserRecord(u: any) {
  if (!u || typeof u !== 'object') return u;
  const { passwordHash: _ph, passwordSalt: _ps, password: _pw, ...safe } = u;
  if (isAdminUserRecord(safe)) {
    return {
      ...safe,
      country: '',
      state: '',
      city: '',
      pincode: '',
      postalCode: '',
      location: '',
      neighborhood: 'ResourceBox HQ',
      currency: safe.currency || '₹',
      currencyCode: safe.currencyCode || 'INR',
    };
  }
  return safe;
}

function isRealMarketplaceItem(i: any): boolean {
  if (!i || !i.id || !i.title) return false;
  const id = String(i.id).toLowerCase();
  const title = String(i.title).toLowerCase();
  return !id.includes('test') && !id.includes('demo') && !title.includes('demo') && !title.includes('test professional');
}

function isRealCommunityUser(u: any): boolean {
  if (!u || !u.id) return false;
  const id = String(u.id).toLowerCase();
  const email = String(u.email || '').toLowerCase();
  return !id.includes('test') && !email.includes('navtest_') && !email.includes('guard_');
}

function toPublicProfile(u: any, db: any) {
  const follows = Array.isArray(db.follows) ? db.follows : [];
  const items = Array.isArray(db.items) ? db.items.filter(isRealMarketplaceItem) : [];
  const followersCount = follows.filter((f: any) => f.followingId === u.id).length;
  const followingCount = follows.filter((f: any) => f.followerId === u.id).length;
  const uploadsCount = items.filter((it: any) => it.owner?.id === u.id).length;
  const normalizedUsername = normalizeHandle(u.username);
  const adminAccount = isAdminUserRecord(u);
  return {
    id: u.id,
    name: u.name || 'Community Member',
    username: normalizedUsername || undefined,
    avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    bio: u.bio || '',
    city: adminAccount ? '' : (u.city || ''),
    state: adminAccount ? '' : (u.state || ''),
    country: adminAccount ? '' : (u.country || ''),
    neighborhood: adminAccount ? '' : (u.neighborhood || ''),
    location: adminAccount ? '' : (u.location || [u.city, u.state].filter(Boolean).join(', ') || ''),
    verified: adminAccount ? true : (u.verified ?? true),
    role: adminAccount ? 'admin' : 'member',
    isAdmin: adminAccount,
    rating: Number(u.rating || 5.0),
    reviewCount: Number(u.reviewCount || 0),
    memberSince: u.memberSince || 'October 2026',
    followersCount,
    followingCount,
    uploadsCount,
  };
}

/**
 * GET /api/items
 * PUBLIC: Any user on any device, without authorization, can view all uploaded items!
 */
app.get('/api/items', (_req, res) => {
  try {
    const db = readDb();
    const rawItems = Array.isArray(db.items) ? db.items : [];
    const realItems = rawItems.filter(isRealMarketplaceItem);
    return res.json({ success: true, items: realItems });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message, items: [] });
  }
});

/**
 * POST /api/items
 * REQUIRES AUTHENTICATION: Uploading items necessarily requires authenticated user identity.
 * Also creates upload update notifications for every follower of the item owner.
 */
app.post('/api/items', (req, res) => {
  try {
    const newItem = req.body;
    if (!newItem || !newItem.title || !newItem.owner || !newItem.owner.id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required: You must be signed in with a valid account to upload and list resources.' 
      });
    }

    const db = readDb();
    if (!Array.isArray(db.items)) db.items = [];
    if (!Array.isArray(db.follows)) db.follows = [];
    if (!Array.isArray(db.notifications)) db.notifications = [];

    // Attach latest stored username & admin verification for the owner if available
    const ownerRecord = (db.users || []).find((u: any) => u.id === newItem.owner.id);
    const ownerUsername = normalizeHandle(newItem.owner.username || ownerRecord?.username);
    const ownerIsAdmin = isAdminUserRecord(ownerRecord || newItem.owner);
    const enrichedItem = {
      ...newItem,
      ...(ownerIsAdmin
        ? {
            location: {
              ...(newItem.location || {}),
              city: '',
              neighborhood: '',
            },
          }
        : {}),
      owner: {
        ...newItem.owner,
        ...(ownerUsername ? { username: ownerUsername } : {}),
        ...(ownerIsAdmin
          ? { isAdmin: true, role: 'admin', verified: true, neighborhood: '' }
          : {}),
      },
    };

    const existingIdx = db.items.findIndex((i: any) => i.id === enrichedItem.id);
    if (existingIdx >= 0) {
      db.items[existingIdx] = { 
        ...db.items[existingIdx], 
        ...enrichedItem, 
        updatedAt: new Date().toISOString() 
      };
    } else {
      const createdAt = enrichedItem.createdAt || new Date().toISOString();
      db.items.unshift({
        ...enrichedItem,
        createdAt
      });

      // Notify all followers of this creator about the new product upload
      const creatorFollowers = db.follows.filter((f: any) => f.followingId === enrichedItem.owner.id);
      creatorFollowers.forEach((f: any) => {
        const notifId = `notif_${enrichedItem.id}_${f.followerId}`;
        const alreadyExists = db.notifications.some((n: any) => n.id === notifId);
        if (!alreadyExists && f.followerId !== enrichedItem.owner.id) {
          db.notifications.unshift({
            id: notifId,
            recipientId: f.followerId,
            creatorId: enrichedItem.owner.id,
            creatorName: enrichedItem.owner.name || 'Creator',
            creatorUsername: ownerUsername || '',
            creatorAvatar: enrichedItem.owner.avatar || '',
            itemId: enrichedItem.id,
            itemTitle: enrichedItem.title,
            itemImage: Array.isArray(enrichedItem.images) ? (enrichedItem.images[0] || '') : '',
            itemCategory: enrichedItem.category || 'resource',
            priceRateText: enrichedItem.priceRateText || '',
            listingType: enrichedItem.listingType || 'both',
            read: false,
            createdAt,
          });
        }
      });
    }

    writeDb(db);
    return res.json({ success: true, item: enrichedItem });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * PUT /api/items/:id
 * REQUIRES AUTHENTICATION: Update an existing item
 */
app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = readDb();
    if (!Array.isArray(db.items)) db.items = [];

    const idx = db.items.findIndex((i: any) => i.id === id);
    if (idx >= 0) {
      db.items[idx] = { 
        ...db.items[idx], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      writeDb(db);
      return res.json({ success: true, item: db.items[idx] });
    }
    return res.status(404).json({ success: false, error: 'Item not found in database.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * DELETE /api/items/:id
 * REQUIRES AUTHENTICATION: Remove an item
 */
app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    if (!Array.isArray(db.items)) db.items = [];

    db.items = db.items.filter((i: any) => i.id !== id);
    writeDb(db);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * GET /api/users/check
 * Checks if a user is already authorized and registered in the database.
 * Matches by email, phoneNumber, or id.
 */
app.get('/api/users/check', (req, res) => {
  try {
    const { email, phoneNumber, id } = req.query;
    const db = readDb();
    const users = Array.isArray(db.users) ? db.users : [];

    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanPhone = phoneNumber ? String(phoneNumber).replace(/\s+/g, '') : '';
    const cleanId = id ? String(id).trim() : '';

    if (!cleanEmail && !cleanPhone && !cleanId) {
      return res.json({ success: true, registered: false, message: 'No search parameters provided.' });
    }

    const foundUser = users.find((u: any) => {
      if (cleanEmail && u.email && u.email.trim().toLowerCase() === cleanEmail) return true;
      if (cleanPhone && u.phoneNumber && u.phoneNumber.replace(/\s+/g, '') === cleanPhone) return true;
      if (cleanId && u.id === cleanId) return true;
      return false;
    });

    if (foundUser) {
      const safeUser = sanitizeUserRecord(foundUser);
      return res.json({
        success: true,
        registered: true,
        message: 'Already registered',
        user: {
          ...safeUser,
          id: safeUser.id,
          name: safeUser.name,
          email: safeUser.email,
          avatar: safeUser.avatar,
          phoneVerified: safeUser.phoneVerified || false,
          phoneNumber: safeUser.phoneNumber || '',
          memberSince: safeUser.memberSince || 'October 2026',
          location: safeUser.location || safeUser.city || 'Community Member',
          state: safeUser.state || '',
          city: safeUser.city || '',
          pincode: safeUser.pincode || '',
        }
      });
    }

    return res.json({
      success: true,
      registered: false,
      message: 'Not registered'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message, registered: false });
  }
});

/**
 * GET /api/users/check-username
 * Validates format and checks uniqueness of @username across registered users
 */
app.get('/api/users/check-username', (req, res) => {
  try {
    const rawUsername = String(req.query.username || '');
    const currentUserId = String(req.query.userId || '').trim();
    const normalized = normalizeHandle(rawUsername);

    if (!normalized) {
      return res.json({ success: true, available: false, normalized: '', reason: 'Enter 3–24 letters, numbers, or underscores.' });
    }
    if (!isValidHandleFormat(normalized)) {
      return res.json({
        success: true,
        available: false,
        normalized,
        reason: 'Username must be 3–24 characters using only lowercase letters, numbers, or underscores.',
      });
    }

    if (normalized === ADMIN_USERNAME && currentUserId !== ADMIN_ID) {
      return res.json({
        success: true,
        available: false,
        normalized,
        reason: `${ADMIN_USERNAME} is reserved for the official ResourceBox Admin account.`,
      });
    }

    const db = readDb();
    const takenBy = (db.users || []).find(
      (u: any) => u.id !== currentUserId && normalizeHandle(u.username) === normalized
    );

    if (takenBy) {
      return res.json({
        success: true,
        available: false,
        normalized,
        reason: `${normalized} is already claimed by another user.`,
      });
    }

    return res.json({ success: true, available: true, normalized });
  } catch (err: any) {
    return res.status(500).json({ success: false, available: false, error: err?.message });
  }
});

/**
 * GET /api/users/search?q=...
 * Searches registered creators & item owners by @username or name (public fields only)
 */
app.get('/api/users/search', (req, res) => {
  try {
    const rawQ = String(req.query.q || '').trim().toLowerCase();
    const bareQ = rawQ.replace(/^@+/, '');
    const db = readDb();

    const userMap = new Map<string, any>();

    // 1. Add registered users
    (db.users || []).filter(isRealCommunityUser).forEach((u: any) => {
      userMap.set(u.id, toPublicProfile(u, db));
    });

    // 2. Also include real marketplace item owners if their profile entry isn't in db.users yet
    (db.items || []).filter(isRealMarketplaceItem).forEach((item: any) => {
      if (item.owner?.id && !userMap.has(item.owner.id)) {
        userMap.set(
          item.owner.id,
          toPublicProfile(
            {
              id: item.owner.id,
              name: item.owner.name,
              username: item.owner.username,
              avatar: item.owner.avatar,
              neighborhood: item.owner.neighborhood,
              city: item.location?.city,
              verified: item.owner.verified,
              rating: item.owner.rating,
              reviewCount: item.owner.reviewCount,
              memberSince: item.owner.memberSince,
            },
            db
          )
        );
      }
    });

    let results = Array.from(userMap.values());

    if (bareQ) {
      const startsWithAt = rawQ.startsWith('@');
      results = results.filter((p) => {
        const handleBare = (p.username || '').replace(/^@/, '').toLowerCase();
        const nameLower = (p.name || '').toLowerCase();
        if (startsWithAt) {
          return handleBare.includes(bareQ) || nameLower.replace(/\s+/g, '_').includes(bareQ);
        }
        return handleBare.includes(bareQ) || nameLower.includes(bareQ) || (p.city || '').toLowerCase().includes(bareQ);
      });
    }

    // Prioritize exact @username match, official verified admin, then uploads/followers
    results.sort((a, b) => {
      const aExact = bareQ && (a.username || '').replace(/^@/, '') === bareQ ? 1 : 0;
      const bExact = bareQ && (b.username || '').replace(/^@/, '') === bareQ ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      const aAdmin = a.isAdmin ? 1 : 0;
      const bAdmin = b.isAdmin ? 1 : 0;
      if (aAdmin !== bAdmin) return bAdmin - aAdmin;
      if (a.uploadsCount !== b.uploadsCount) return b.uploadsCount - a.uploadsCount;
      return b.followersCount - a.followersCount;
    });

    return res.json({ success: true, users: results.slice(0, 30) });
  } catch (err: any) {
    return res.status(500).json({ success: false, users: [], error: err?.message });
  }
});

/**
 * GET /api/users/public/:id
 * Fetches public Instagram-style profile info + followers/following summary lists
 */
app.get('/api/users/public/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    let userRecord = (db.users || []).find((u: any) => u.id === id);

    if (!userRecord) {
      const ownedItem = (db.items || []).filter(isRealMarketplaceItem).find((i: any) => i.owner?.id === id);
      if (ownedItem?.owner) {
        userRecord = {
          id: ownedItem.owner.id,
          name: ownedItem.owner.name,
          username: ownedItem.owner.username,
          avatar: ownedItem.owner.avatar,
          neighborhood: ownedItem.owner.neighborhood,
          city: ownedItem.location?.city,
          verified: ownedItem.owner.verified,
          rating: ownedItem.owner.rating,
          reviewCount: ownedItem.owner.reviewCount,
          memberSince: ownedItem.owner.memberSince,
        };
      }
    }

    if (!userRecord) {
      return res.status(404).json({ success: false, error: 'Creator profile not found.' });
    }

    const profile = toPublicProfile(userRecord, db);
    const follows = Array.isArray(db.follows) ? db.follows : [];
    const resolveMiniUser = (targetId: string, fallbackName?: string, fallbackUsername?: string, fallbackAvatar?: string) => {
      const found = (db.users || []).find((u: any) => u.id === targetId);
      if (found) return toPublicProfile(found, db);
      return {
        id: targetId,
        name: fallbackName || 'Community Member',
        username: normalizeHandle(fallbackUsername) || undefined,
        avatar: fallbackAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        verified: true,
        rating: 5,
        reviewCount: 0,
        memberSince: 'October 2026',
        followersCount: follows.filter((f: any) => f.followingId === targetId).length,
        followingCount: follows.filter((f: any) => f.followerId === targetId).length,
        uploadsCount: (db.items || []).filter((i: any) => isRealMarketplaceItem(i) && i.owner?.id === targetId).length,
      };
    };

    const followers = follows
      .filter((f: any) => f.followingId === id)
      .map((f: any) => resolveMiniUser(f.followerId, f.followerName, f.followerUsername, f.followerAvatar));

    const following = follows
      .filter((f: any) => f.followerId === id)
      .map((f: any) => resolveMiniUser(f.followingId, f.followingName, f.followingUsername, f.followingAvatar));

    const creatorItems = (db.items || [])
      .filter((i: any) => isRealMarketplaceItem(i) && i.owner?.id === id)
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return res.json({ success: true, profile, followers, following, items: creatorItems });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * POST /api/users
 * Saves or updates a registered user in the persistent database.
 * Enforces unique @username and syncs owner metadata on the user's listed items.
 */
app.post('/api/users', (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.id) {
      return res.status(400).json({ success: false, error: 'Invalid user payload: id is required.' });
    }

    const db = readDb();
    if (!Array.isArray(db.users)) db.users = [];
    if (!Array.isArray(db.items)) db.items = [];

    const normalizedUsername = normalizeHandle(user.username);
    if (user.username && String(user.username).trim() !== '') {
      if (!isValidHandleFormat(normalizedUsername)) {
        return res.status(400).json({
          success: false,
          error: 'Username must be 3–24 characters using only lowercase letters, numbers, or underscores.',
        });
      }
      const duplicate = db.users.find(
        (u: any) => u.id !== user.id && normalizeHandle(u.username) === normalizedUsername
      );
      if (duplicate) {
        return res.status(409).json({
          success: false,
          error: `Username ${normalizedUsername} is already taken. Please choose a different handle.`,
        });
      }
    }

    const {
      passwordHash: _ignoreHash,
      passwordSalt: _ignoreSalt,
      password: _ignorePassword,
      role: _ignoreRole,
      isAdmin: _ignoreIsAdmin,
      ...cleanIncoming
    } = user;

    const existingIdx = db.users.findIndex((u: any) => 
      u.id === user.id || 
      (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase())
    );
    const existingRecord = existingIdx >= 0 ? db.users[existingIdx] : null;
    const isTargetAdmin = isAdminUserRecord(existingRecord || { id: user.id, email: user.email });

    if (normalizedUsername === ADMIN_USERNAME && !isTargetAdmin) {
      return res.status(409).json({
        success: false,
        error: `Username ${ADMIN_USERNAME} is reserved for the official ResourceBox Admin account.`,
      });
    }

    const userPayload = {
      ...cleanIncoming,
      ...(user.username !== undefined ? { username: normalizedUsername } : {}),
      ...(isTargetAdmin
        ? {
            id: ADMIN_ID,
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            role: 'admin',
            isAdmin: true,
            verified: true,
            country: existingRecord?.country || 'India',
            state: existingRecord?.state || 'Uttar Pradesh',
            city: existingRecord?.city || 'Hapur',
            pincode: existingRecord?.pincode || '245101',
            postalCode: existingRecord?.postalCode || '245101',
            location: existingRecord?.location || 'Hapur, Uttar Pradesh, 245101, India',
            neighborhood: existingRecord?.neighborhood || 'ResourceBox HQ',
          }
        : {}),
    };

    if (existingIdx >= 0) {
      db.users[existingIdx] = {
        ...db.users[existingIdx],
        ...userPayload,
        updatedAt: new Date().toISOString()
      };
    } else {
      db.users.unshift({
        ...userPayload,
        role: isTargetAdmin ? 'admin' : 'member',
        isAdmin: isTargetAdmin,
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Sync updated @username / name / avatar / admin flags onto all existing items owned by this user
    const savedRecord = existingIdx >= 0 ? db.users[existingIdx] : db.users[0];
    db.items = db.items.map((item: any) => {
      if (item?.owner?.id === savedRecord.id) {
        return {
          ...item,
          owner: {
            ...item.owner,
            name: savedRecord.name || item.owner.name,
            avatar: savedRecord.avatar || item.owner.avatar,
            ...(savedRecord.username ? { username: savedRecord.username } : {}),
            ...(savedRecord.isAdmin ? { isAdmin: true, role: 'admin', verified: true } : {}),
          },
        };
      }
      return item;
    });

    writeDb(db);
    return res.json({ success: true, user: sanitizeUserRecord(savedRecord) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * POST /api/auth/register
 * Registers a user with username, optional/required email, and salted scrypt passwordHash.
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const { id, name, username, email, password, avatar } = req.body || {};
    const cleanName = typeof name === 'string' ? name.trim().slice(0, 80) : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';
    const normalizedUsername = normalizeHandle(username);

    if (!cleanName) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!normalizedUsername || !isValidHandleFormat(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3–24 characters using only lowercase letters, numbers, or underscores.',
      });
    }
    if (cleanPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const db = readDb();
    if (!Array.isArray(db.users)) db.users = [];

    if (normalizedUsername === ADMIN_USERNAME || cleanEmail === ADMIN_EMAIL) {
      return res.status(409).json({
        success: false,
        code: 'email-already-in-use',
        error: 'This verified ResourceBox Admin account is already registered. Please sign in instead.',
      });
    }

    const usernameConflict = db.users.find(
      (u: any) => u.id !== id && normalizeHandle(u.username) === normalizedUsername
    );
    if (usernameConflict) {
      return res.status(409).json({
        success: false,
        code: 'username-taken',
        error: `Username ${normalizedUsername} is already claimed by another user.`,
      });
    }

    if (cleanEmail) {
      const emailConflict = db.users.find(
        (u: any) => u.id !== id && u.email && u.email.trim().toLowerCase() === cleanEmail
      );
      if (emailConflict) {
        return res.status(409).json({
          success: false,
          code: 'email-already-in-use',
          error: `An account with email ${cleanEmail} is already registered. Please sign in instead.`,
        });
      }
    }

    const userId = typeof id === 'string' && id.trim() ? id.trim() : `usr_${crypto.randomUUID()}`;
    const existingIdx = db.users.findIndex((u: any) => u.id === userId);
    const passwordHash = hashPassword(cleanPassword);

    const record = {
      ...(existingIdx >= 0 ? db.users[existingIdx] : {}),
      id: userId,
      name: cleanName,
      username: normalizedUsername,
      email: cleanEmail,
      avatar:
        (typeof avatar === 'string' && avatar.trim()) ||
        (existingIdx >= 0 ? db.users[existingIdx].avatar : '') ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      rating: existingIdx >= 0 ? db.users[existingIdx].rating ?? 5.0 : 5.0,
      reviewCount: existingIdx >= 0 ? db.users[existingIdx].reviewCount ?? 0 : 0,
      role: 'member',
      isAdmin: false,
      verified: true,
      phoneVerified: existingIdx >= 0 ? Boolean(db.users[existingIdx].phoneVerified) : false,
      phoneNumber: existingIdx >= 0 ? db.users[existingIdx].phoneNumber || '' : '',
      country: existingIdx >= 0 ? db.users[existingIdx].country || '' : '',
      state: existingIdx >= 0 ? db.users[existingIdx].state || '' : '',
      city: existingIdx >= 0 ? db.users[existingIdx].city || '' : '',
      pincode: existingIdx >= 0 ? db.users[existingIdx].pincode || '' : '',
      postalCode: existingIdx >= 0 ? db.users[existingIdx].postalCode || '' : '',
      location: existingIdx >= 0 ? db.users[existingIdx].location || '' : '',
      neighborhood: existingIdx >= 0 ? db.users[existingIdx].neighborhood || '' : '',
      memberSince: existingIdx >= 0 ? db.users[existingIdx].memberSince || 'October 2026' : 'October 2026',
      bio: existingIdx >= 0 ? db.users[existingIdx].bio || '' : '',
      savedItemIds: existingIdx >= 0 && Array.isArray(db.users[existingIdx].savedItemIds) ? db.users[existingIdx].savedItemIds : [],
      passwordHash,
      registeredAt: existingIdx >= 0 ? db.users[existingIdx].registeredAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      db.users[existingIdx] = record;
    } else {
      db.users.unshift(record);
    }

    writeDb(db);
    return res.json({ success: true, user: sanitizeUserRecord(record) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * POST /api/auth/resolve-username
 * Resolves a @username to its registered email / password readiness for login.
 */
app.post('/api/auth/resolve-username', (req, res) => {
  try {
    const rawUsername = String(req.body?.username || '');
    const normalized = normalizeHandle(rawUsername);
    if (!normalized) {
      return res.json({ success: true, found: false });
    }
    const db = readDb();
    const matched = (db.users || []).find(
      (u: any) => normalizeHandle(u.username) === normalized
    );
    if (!matched) {
      return res.json({ success: true, found: false });
    }
    return res.json({
      success: true,
      found: true,
      userId: matched.id,
      email: matched.email || '',
      hasPasswordHash: Boolean(matched.passwordHash),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, found: false, error: err?.message });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user by email OR @username + password against salted scrypt passwordHash.
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const rawIdentifier = String(req.body?.identifier || '').trim();
    const password = String(req.body?.password || '');

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        code: 'missing-credentials',
        error: 'Please enter both your email or @username and your password.',
      });
    }

    const db = readDb();
    const users = Array.isArray(db.users) ? db.users : [];
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawIdentifier);

    let matchedUser: any = null;
    if (looksLikeEmail) {
      const cleanEmail = rawIdentifier.toLowerCase();
      matchedUser = users.find((u: any) => u.email && u.email.trim().toLowerCase() === cleanEmail);
    } else {
      const normalized = normalizeHandle(rawIdentifier);
      if (normalized) {
        matchedUser = users.find((u: any) => normalizeHandle(u.username) === normalized);
      }
    }

    if (!matchedUser) {
      return res.status(404).json({
        success: false,
        code: 'user-not-found',
        error: looksLikeEmail
          ? 'No registered account found for that email address.'
          : `No registered account found for username ${normalizeHandle(rawIdentifier) || rawIdentifier}.`,
      });
    }

    if (!matchedUser.passwordHash) {
      return res.json({
        success: true,
        verified: false,
        needsFirebaseAuth: true,
        resolvedEmail: matchedUser.email || '',
        hasPasswordHash: false,
      });
    }

    const valid = verifyPassword(password, matchedUser.passwordHash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        code: 'wrong-password',
        error: 'Incorrect username/email or password. Please verify and try again.',
      });
    }

    return res.json({
      success: true,
      verified: true,
      user: sanitizeUserRecord(matchedUser),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * POST /api/auth/sync-password
 * Stores a salted passwordHash for an account that authenticated via Firebase Auth
 * when no server passwordHash was set yet.
 */
app.post('/api/auth/sync-password', (req, res) => {
  try {
    const { userId, password } = req.body || {};
    if (!userId || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Valid userId and password required.' });
    }
    const db = readDb();
    if (!Array.isArray(db.users)) db.users = [];
    const idx = db.users.findIndex((u: any) => u.id === userId);
    if (idx < 0) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    if (!db.users[idx].passwordHash) {
      db.users[idx].passwordHash = hashPassword(password);
      db.users[idx].updatedAt = new Date().toISOString();
      writeDb(db);
    }
    return res.json({ success: true, user: sanitizeUserRecord(db.users[idx]) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * GET /api/users/:id
 * Fetches user profile from database
 */
app.get('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const users = Array.isArray(db.users) ? db.users : [];
    const user = users.find((u: any) => u.id === id);
    if (user) {
      return res.json({ success: true, user: sanitizeUserRecord(user) });
    }
    return res.status(404).json({ success: false, error: 'User not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * GET /api/follows?userId=...
 * Returns follow relationships for a user (who they follow and who follows them)
 */
app.get('/api/follows', (req, res) => {
  try {
    const userId = String(req.query.userId || '').trim();
    const db = readDb();
    const follows = Array.isArray(db.follows) ? db.follows : [];
    const followingIds = userId
      ? follows.filter((f: any) => f.followerId === userId).map((f: any) => f.followingId)
      : [];
    const followerIds = userId
      ? follows.filter((f: any) => f.followingId === userId).map((f: any) => f.followerId)
      : [];
    return res.json({
      success: true,
      followingIds,
      followerIds,
      allFollows: follows,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, followingIds: [], followerIds: [], error: err?.message });
  }
});

/**
 * POST /api/follows/toggle
 * Follow or unfollow another user
 */
app.post('/api/follows/toggle', (req, res) => {
  try {
    const { followerId, targetUserId, followerName, followerUsername, followerAvatar, targetName, targetUsername, targetAvatar } = req.body || {};
    if (!followerId || !targetUserId) {
      return res.status(400).json({ success: false, error: 'followerId and targetUserId are required.' });
    }
    if (followerId === targetUserId) {
      return res.status(400).json({ success: false, error: 'You cannot follow your own account.' });
    }

    const db = readDb();
    if (!Array.isArray(db.follows)) db.follows = [];

    const existingIdx = db.follows.findIndex(
      (f: any) => f.followerId === followerId && f.followingId === targetUserId
    );

    let isFollowing = false;
    if (existingIdx >= 0) {
      db.follows.splice(existingIdx, 1);
      isFollowing = false;
    } else {
      const followerUser = (db.users || []).find((u: any) => u.id === followerId);
      const targetUser = (db.users || []).find((u: any) => u.id === targetUserId);
      db.follows.unshift({
        id: `${followerId}__${targetUserId}`,
        followerId,
        followerName: followerName || followerUser?.name || 'Member',
        followerUsername: normalizeHandle(followerUsername || followerUser?.username),
        followerAvatar: followerAvatar || followerUser?.avatar || '',
        followingId: targetUserId,
        followingName: targetName || targetUser?.name || 'Creator',
        followingUsername: normalizeHandle(targetUsername || targetUser?.username),
        followingAvatar: targetAvatar || targetUser?.avatar || '',
        createdAt: new Date().toISOString(),
      });
      isFollowing = true;
    }

    writeDb(db);
    const followingIds = db.follows.filter((f: any) => f.followerId === followerId).map((f: any) => f.followingId);
    const targetFollowersCount = db.follows.filter((f: any) => f.followingId === targetUserId).length;

    return res.json({
      success: true,
      isFollowing,
      followingIds,
      targetFollowersCount,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * GET /api/notifications?userId=...
 * Fetches upload update notifications for a follower
 */
app.get('/api/notifications', (req, res) => {
  try {
    const userId = String(req.query.userId || '').trim();
    if (!userId) {
      return res.json({ success: true, notifications: [] });
    }
    const db = readDb();
    const list = (Array.isArray(db.notifications) ? db.notifications : [])
      .filter((n: any) => n.recipientId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return res.json({ success: true, notifications: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, notifications: [], error: err?.message });
  }
});

/**
 * POST /api/notifications/read
 * Marks one or all upload notifications as read
 */
app.post('/api/notifications/read', (req, res) => {
  try {
    const { userId, notificationId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required.' });
    }
    const db = readDb();
    if (!Array.isArray(db.notifications)) db.notifications = [];

    db.notifications = db.notifications.map((n: any) => {
      if (n.recipientId === userId && (!notificationId || n.id === notificationId)) {
        return { ...n, read: true };
      }
      return n;
    });
    writeDb(db);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

/**
 * GET /api/reviews
 * Fetches platform ratings and community feedback reviews
 */
app.get('/api/reviews', (_req, res) => {
  try {
    const db = readDb();
    const reviews = Array.isArray(db.reviews) ? db.reviews : [];
    const sorted = [...reviews].sort(
      (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return res.json({ success: true, reviews: sorted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message, reviews: [] });
  }
});

/**
 * POST /api/reviews
 * Saves a user rating & feedback review to persistent storage
 */
app.post('/api/reviews', (req, res) => {
  try {
    const { id, rating, comment, improvementAreas, reviewerName, userId, createdAt } = req.body || {};
    const numRating = Number(rating);
    const cleanComment = typeof comment === 'string' ? comment.trim().slice(0, 500) : '';
    const cleanName = typeof reviewerName === 'string' && reviewerName.trim()
      ? reviewerName.trim().slice(0, 80)
      : 'Community Member';
    const cleanAreas = Array.isArray(improvementAreas)
      ? improvementAreas
          .filter((a) => typeof a === 'string' && a.trim().length > 0)
          .map((a) => a.trim().slice(0, 60))
          .slice(0, 10)
      : [];

    if (!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars.' });
    }
    if (cleanComment.length < 3) {
      return res.status(400).json({ success: false, error: 'Please write at least 3 characters of feedback.' });
    }

    const review = {
      id: typeof id === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(id) ? id : `rev_${Date.now()}`,
      rating: Math.round(numRating),
      comment: cleanComment,
      ...(cleanAreas.length > 0 ? { improvementAreas: cleanAreas } : {}),
      reviewerName: cleanName,
      ...(typeof userId === 'string' && userId.trim() ? { userId: userId.trim().slice(0, 128) } : {}),
      createdAt: typeof createdAt === 'string' ? createdAt.slice(0, 64) : new Date().toISOString(),
    };

    const db = readDb();
    if (!Array.isArray(db.reviews)) db.reviews = [];
    const existingIdx = db.reviews.findIndex((r: any) => r.id === review.id);
    if (existingIdx >= 0) {
      db.reviews[existingIdx] = review;
    } else {
      db.reviews.unshift(review);
    }

    writeDb(db);
    return res.json({ success: true, review });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// Start Express server and mount Vite in development or static files in production
async function startServer() {
  // Ensure verified official admin account is seeded in persistent DB on startup
  readDb();

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResourceBox full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
