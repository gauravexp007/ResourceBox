import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
  where
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { Item, ExchangeProposal, RentalBooking, ChatConversation, ChatMessage, User, PlatformReview, PublicUserProfile, UserFollow, UploadNotification } from '../types';

/**
 * Real-time subscription to marketplace items.
 * All items uploaded by users to the database are permanently stored in Firebase Firestore
 * and visible in real-time to all users on any device.
 */
export function subscribeToItems(
  onUpdate: (items: Item[]) => void,
  onError?: (err: any) => void
) {
  let isMounted = true;
  let lastItemsJson = '';
  let pollingInterval: any = null;

  const sortItems = (list: Item[]) => {
    return [...list].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  };

  const dispatchUpdate = (list: Item[]) => {
    // Purge any demo or test items - only real items saved in database are shown
    const cleanList = list.filter((i) => {
      if (!i || !i.id || !i.title) return false;
      const id = String(i.id).toLowerCase();
      const title = String(i.title).toLowerCase();
      return !id.includes('test') && !id.includes('demo') && !title.includes('demo') && !title.includes('test professional');
    });
    const sorted = sortItems(cleanList);
    const jsonStr = JSON.stringify(sorted.map((i) => ({ id: i.id, title: i.title, p: i.priceDaily, av: i.isAvailable })));
    if (jsonStr !== lastItemsJson) {
      lastItemsJson = jsonStr;
      onUpdate(sorted);
    }
  };

  // Immediate query to persistent database API so frontdesk displays items instantly without login
  const fetchFromDatabaseApi = async () => {
    try {
      const res = await fetch('/api/items');
      if (!res.ok) return null;
      const data = await res.json();
      if (isMounted && data.success && Array.isArray(data.items)) {
        dispatchUpdate(data.items);
        return data.items;
      }
    } catch (e) {
      console.warn('Database items fetch notice:', e);
    }
    return null;
  };

  // 1. Immediate direct fetch from database on mount for zero-delay frontdesk display
  fetchFromDatabaseApi();

  // 2. Fetch and synchronize with Firestore cloud database
  try {
    const itemsCol = collection(db, 'items');
    getDocs(itemsCol)
      .then(async (snapshot) => {
        if (!isMounted) return;
        const serverItems = (await fetchFromDatabaseApi()) || [];
        const mergedMap = new Map<string, Item>();
        serverItems.forEach((it: Item) => {
          if (it?.id) mergedMap.set(it.id, it);
        });
        snapshot.forEach((docSnap) => {
          const itemData = { id: docSnap.id, ...docSnap.data() } as Item;
          if (!mergedMap.has(itemData.id)) {
            mergedMap.set(itemData.id, itemData);
          }
          if (itemData?.title && itemData?.owner?.id) {
            fetch('/api/items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanFirestoreData(itemData)),
            }).catch(() => {});
          }
        });
        if (mergedMap.size > 0) {
          dispatchUpdate(Array.from(mergedMap.values()));
        }
      })
      .catch((err) => {
        console.warn('Initial Firestore items fetch notice:', err);
        // Fallback to database API
        fetchFromDatabaseApi();
      });
  } catch (err) {
    console.warn('Error initiating initial Firestore items fetch:', err);
    fetchFromDatabaseApi();
  }

  // 3. Real-time Firestore onSnapshot listener
  let unsubFirestore: (() => void) = () => {};
  try {
    const itemsCol = collection(db, 'items');
    unsubFirestore = onSnapshot(
      itemsCol,
      (snapshot) => {
        if (!isMounted) return;
        const list: Item[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            ...data,
          } as Item);
        });
        if (list.length > 0) {
          dispatchUpdate(list);
        } else {
          fetchFromDatabaseApi();
        }
      },
      (error) => {
        console.warn('Firestore items sync notice:', error);
        onError?.(error);
        // Fallback to database API and start background polling so multi-user sync keeps working seamlessly
        fetchFromDatabaseApi();
        if (!pollingInterval) {
          pollingInterval = setInterval(() => {
            if (isMounted) fetchFromDatabaseApi();
          }, 3500);
        }
      }
    );
  } catch (err) {
    console.warn('Firestore onSnapshot init notice:', err);
    if (!pollingInterval) {
      pollingInterval = setInterval(() => {
        if (isMounted) fetchFromDatabaseApi();
      }, 3500);
    }
  }

  return () => {
    isMounted = false;
    unsubFirestore();
    if (pollingInterval) clearInterval(pollingInterval);
  };
}

/**
 * Recursively removes undefined fields from an object so Firestore setDoc/updateDoc
 * never throws "Unsupported field value: undefined" errors.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanFirestoreData).filter((x) => x !== undefined) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const res: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        res[key] = cleanFirestoreData(value);
      }
    }
    return res as T;
  }
  return obj;
}

/**
 * Add a new marketplace item to database.
 * Stored permanently in Firebase Firestore and mirrored to server database.
 */
export async function createItemInFirestore(item: Item): Promise<void> {
  const sanitized = cleanFirestoreData({
    ...item,
    updatedAt: new Date().toISOString(),
  });

  // 1. Primary write to Firestore cloud database
  try {
    const docRef = doc(db, 'items', item.id);
    await setDoc(docRef, sanitized);
    console.log('Item permanently saved to Firebase Firestore:', item.id);
  } catch (error) {
    console.warn('Notice saving item to Firestore cloud:', error);
  }

  // 2. Dual-write to persistent server database for instant multi-user mirroring
  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
    if (!res.ok) {
      console.warn('Notice saving item to server database:', await res.text());
    } else {
      console.log('Item mirrored to server database:', item.id);
    }
  } catch (err) {
    console.warn('Notice saving item to server database:', err);
  }
}

/**
 * Update an existing item (e.g. price, availability) in Firestore permanently
 */
export async function updateItemInFirestore(itemId: string, updates: Partial<Item>): Promise<void> {
  const sanitized = cleanFirestoreData({
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  // 1. Mirror in server database
  try {
    await fetch(`/api/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
  } catch (err) {
    console.warn('Notice updating item in server database:', err);
  }

  // 2. Update in Firestore
  try {
    const docRef = doc(db, 'items', itemId);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.warn('Notice updating item in Firestore:', error);
  }
}

/**
 * Delete an item from Firestore permanently
 */
export async function deleteItemFromFirestore(itemId: string): Promise<void> {
  // 1. Delete from Firestore
  try {
    const docRef = doc(db, 'items', itemId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting item from Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.DELETE, `items/${itemId}`);
    } catch {
      // Handled
    }
  }

  // 2. Delete in server mirror
  try {
    await fetch(`/api/items/${itemId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Notice deleting item from server database:', err);
  }
}

/**
 * Subscribe to rental bookings for the current user (either renter or owner)
 */
export function subscribeToBookings(
  userId: string,
  onUpdate: (bookings: RentalBooking[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, 'bookings');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: RentalBooking[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as RentalBooking;
          if (data.ownerId === userId || data.renterId === userId) {
            list.push({ ...data, id: d.id });
          }
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      },
      (err) => {
        console.warn('Error fetching bookings:', err);
        onError?.(err);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'bookings');
    return () => {};
  }
}

/**
 * Create a new rental booking in Firestore
 */
export async function createBookingInFirestore(booking: RentalBooking): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', booking.id);
    await setDoc(docRef, booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `bookings/${booking.id}`);
  }
}

/**
 * Subscribe to exchange proposals for the current user
 */
export function subscribeToProposals(
  userId: string,
  onUpdate: (proposals: ExchangeProposal[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, 'proposals');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: ExchangeProposal[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as ExchangeProposal;
          if (data.itemOwnerId === userId || data.proposerId === userId) {
            list.push({ ...data, id: d.id });
          }
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      },
      (err) => {
        console.warn('Error fetching proposals:', err);
        onError?.(err);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'proposals');
    return () => {};
  }
}

/**
 * Create a new exchange proposal in Firestore
 */
export async function createProposalInFirestore(proposal: ExchangeProposal): Promise<void> {
  try {
    const docRef = doc(db, 'proposals', proposal.id);
    await setDoc(docRef, proposal);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `proposals/${proposal.id}`);
  }
}

/**
 * Update proposal status (e.g. accepted, declined)
 */
export async function updateProposalStatusInFirestore(
  proposalId: string, 
  status: 'pending' | 'accepted' | 'declined' | 'countered'
): Promise<void> {
  try {
    const docRef = doc(db, 'proposals', proposalId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `proposals/${proposalId}`);
  }
}

/**
 * Subscribe to chat conversations involving the user
 */
export function subscribeToConversations(
  userId: string,
  onUpdate: (conversations: ChatConversation[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, 'conversations');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: ChatConversation[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          const participantIds = data.participantIds || [];
          if (participantIds.includes(userId) || data.partnerId === userId) {
            list.push({ id: d.id, ...data } as ChatConversation);
          }
        });
        onUpdate(list);
      },
      (err) => {
        console.warn('Error fetching conversations:', err);
        onError?.(err);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'conversations');
    return () => {};
  }
}

/**
 * Send chat message and sync conversation to Firestore
 */
export async function sendChatMessageInFirestore(
  conversation: ChatConversation,
  newMessage: ChatMessage
): Promise<void> {
  try {
    const docRef = doc(db, 'conversations', conversation.id);
    const participantIds = Array.from(new Set([
      newMessage.senderId,
      conversation.partnerId,
      ...(conversation as any).participantIds || []
    ])).filter(Boolean);

    await setDoc(docRef, {
      ...conversation,
      participantIds,
      lastMessage: newMessage.text,
      lastMessageTime: 'Just now',
      messages: [...conversation.messages, newMessage],
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `conversations/${conversation.id}`);
  }
}

export function normalizeUsernameHandle(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const bare = raw.trim().replace(/^@+/, '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  return bare ? `@${bare}` : '';
}

export function isValidUsernameFormat(raw?: string): boolean {
  const bare = (raw || '').trim().replace(/^@+/, '').toLowerCase();
  return /^[a-z0-9_]{3,24}$/.test(bare);
}

/**
 * Registers a user with salted scrypt passwordHash in server database and mirrors safe profile to Firestore.
 */
export async function registerUserWithCredentials(params: {
  id?: string;
  name: string;
  username: string;
  email?: string;
  password: string;
  avatar?: string;
}): Promise<User> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success || !data?.user) {
    throw new Error(data?.error || 'Could not register account.');
  }

  const registeredUser = data.user as User;

  // Dual-write safe public profile (no passwordHash) to Firestore without blocking offline/sandboxed flows
  try {
    const userRef = doc(db, 'users', registeredUser.id);
    await Promise.race([
      setDoc(userRef, cleanFirestoreData(registeredUser), { merge: true }),
      new Promise<void>((resolve) => setTimeout(resolve, 1200)),
    ]);
  } catch (err) {
    console.warn('Notice saving registered user to Firestore:', err);
  }

  return registeredUser;
}

/**
 * Resolves a @username to an account's email / userId across server DB and Firestore.
 */
export async function resolveUsernameForLogin(rawUsername: string): Promise<{
  found: boolean;
  email?: string;
  userId?: string;
  hasPasswordHash?: boolean;
}> {
  const normalized = normalizeUsernameHandle(rawUsername);
  if (!normalized) return { found: false };

  try {
    const res = await fetch('/api/auth/resolve-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalized }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.found) {
        return {
          found: true,
          email: data.email || '',
          userId: data.userId,
          hasPasswordHash: Boolean(data.hasPasswordHash),
        };
      }
    }
  } catch (err) {
    console.warn('Server username resolution notice:', err);
  }

  try {
    const q = query(collection(db, 'users'), where('username', '==', normalized));
    const snap = await Promise.race([
      getDocs(q),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200)),
    ]);
    if (snap && !snap.empty) {
      const d = snap.docs[0];
      const u = d.data() as any;
      return {
        found: true,
        email: u?.email || '',
        userId: d.id,
        hasPasswordHash: false,
      };
    }
  } catch (err) {
    console.warn('Firestore username resolution notice:', err);
  }

  return { found: false };
}

/**
 * Authenticates via email or @username + password on server credential store.
 */
export async function loginWithServerCredentials(
  identifier: string,
  password: string
): Promise<{
  verified: boolean;
  user?: User;
  needsFirebaseAuth?: boolean;
  resolvedEmail?: string;
  code?: string;
  error?: string;
}> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      verified: false,
      code: data?.code,
      error: data?.error || 'Incorrect username/email or password.',
    };
  }
  return {
    verified: Boolean(data.verified),
    user: data.user as User | undefined,
    needsFirebaseAuth: Boolean(data.needsFirebaseAuth),
    resolvedEmail: data.resolvedEmail,
  };
}

/**
 * Mirrors password hash on server once Firebase Auth verifies the user so username login works seamlessly.
 */
export async function syncAccountPasswordHash(userId: string, password: string): Promise<void> {
  if (!userId || !password || password.length < 6) return;
  try {
    await fetch('/api/auth/sync-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    });
  } catch {
    // non-fatal
  }
}

/**
 * Save or update user profile permanently in both Firestore and server database.
 * Guarantees cross-device persistence, unique @username validation, and immediate registered user lookup.
 */
export async function saveUserProfile(user: User): Promise<void> {
  const normalizedUsername = user.username ? normalizeUsernameHandle(user.username) : '';
  const sanitized = cleanFirestoreData({
    ...user,
    ...(user.username !== undefined ? { username: normalizedUsername } : {}),
    updatedAt: new Date().toISOString()
  });

  // 1. Dual-write to persistent server database for cross-device visibility & username uniqueness
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sanitized),
  });
  if (!res.ok) {
    let errMsg = 'Failed to save profile.';
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch {
      // ignore json parse error
    }
    throw new Error(errMsg);
  }

  // 2. Dual-write to Firestore cloud database (bounded so offline/sandboxed environments don't hang)
  try {
    const userRef = doc(db, 'users', user.id);
    await Promise.race([
      setDoc(userRef, sanitized, { merge: true }),
      new Promise<void>((resolve) => setTimeout(resolve, 1200)),
    ]);
  } catch (error) {
    console.warn('Notice saving user to Firestore:', error);
  }
}

/**
 * Check if a @username is valid and available across server DB + Firestore
 */
export async function checkUsernameAvailability(
  rawUsername: string,
  currentUserId?: string
): Promise<{ available: boolean; normalized: string; reason?: string }> {
  const normalized = normalizeUsernameHandle(rawUsername);
  if (!normalized) {
    return { available: false, normalized: '', reason: 'Enter 3–24 characters (a–z, 0–9, _).' };
  }
  if (!isValidUsernameFormat(normalized)) {
    return {
      available: false,
      normalized,
      reason: 'Use 3–24 lowercase letters, numbers, or underscores.',
    };
  }

  let serverChecked = false;
  try {
    const params = new URLSearchParams({ username: normalized });
    if (currentUserId) params.append('userId', currentUserId);
    const res = await fetch(`/api/users/check-username?${params.toString()}`);
    if (res.ok) {
      serverChecked = true;
      const data = await res.json();
      if (data.success && !data.available) {
        return { available: false, normalized, reason: data.reason || 'Username already taken.' };
      }
      if (data.success && data.available) {
        return { available: true, normalized };
      }
    }
  } catch (err) {
    console.warn('Server username check notice:', err);
  }

  if (!serverChecked) {
    try {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, where('username', '==', normalized));
      const snap = await Promise.race([
        getDocs(q),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 900)),
      ]);
      if (snap) {
        const conflict = snap.docs.find((d) => d.id !== currentUserId);
        if (conflict) {
          return {
            available: false,
            normalized,
            reason: `${normalized} is already claimed by another user.`,
          };
        }
      }
    } catch (err) {
      console.warn('Firestore username check notice:', err);
    }
  }

  return { available: true, normalized };
}

/**
 * Search community users by @username, full name, or city across server DB, Firestore, and active item owners
 */
export async function searchCommunityUsers(
  queryText: string,
  items: Item[] = []
): Promise<PublicUserProfile[]> {
  const map = new Map<string, PublicUserProfile>();
  const raw = queryText.trim().toLowerCase();
  const bareQ = raw.replace(/^@+/, '');

  // 1. Query Express server search endpoint
  let serverOk = false;
  try {
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(queryText.trim())}`);
    if (res.ok) {
      serverOk = true;
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        data.users.forEach((u: PublicUserProfile) => {
          if (u?.id) map.set(u.id, u);
        });
      }
    }
  } catch (err) {
    console.warn('Server user search notice:', err);
  }

  // 2. Only fall back to Firestore users if server endpoint failed/unavailable
  if (!serverOk) {
    try {
      const snap = await Promise.race([
        getDocs(collection(db, 'users')),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200)),
      ]);
      if (snap) {
        snap.forEach((d) => {
          const data = d.data() as any;
          if (!data) return;
          const idLower = d.id.toLowerCase();
          if (idLower.includes('test') || String(data.email || '').toLowerCase().includes('navtest_')) return;
          const handle = normalizeUsernameHandle(data.username);
          const nameLower = String(data.name || '').toLowerCase();
          const handleBare = handle.replace(/^@/, '');
          const matches = !bareQ
            || handleBare.includes(bareQ)
            || nameLower.includes(bareQ)
            || String(data.city || '').toLowerCase().includes(bareQ);
          if (matches && !map.has(d.id)) {
            map.set(d.id, {
              id: d.id,
              name: data.name || 'Community Member',
              username: handle || undefined,
              avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
              bio: data.bio || '',
              city: data.city || '',
              state: data.state || '',
              country: data.country || '',
              neighborhood: data.neighborhood || '',
              location: data.location || '',
              verified: data.verified ?? true,
              rating: Number(data.rating || 5.0),
              reviewCount: Number(data.reviewCount || 0),
              memberSince: data.memberSince || 'October 2026',
              followersCount: Number(data.followersCount || 0),
              followingCount: Number(data.followingCount || 0),
              uploadsCount: items.filter((i) => i.owner?.id === d.id).length,
            });
          }
        });
      }
    } catch {
      // Firestore offline/restricted; server results suffice
    }
  }

  // 3. Fallback merge any item owners missing from map
  items.forEach((item) => {
    const owner = item.owner;
    if (!owner?.id || map.has(owner.id)) return;
    const handle = normalizeUsernameHandle(owner.username);
    const handleBare = handle.replace(/^@/, '');
    const nameLower = String(owner.name || '').toLowerCase();
    const matches = !bareQ || handleBare.includes(bareQ) || nameLower.includes(bareQ);
    if (matches) {
      map.set(owner.id, {
        id: owner.id,
        name: owner.name || 'Community Member',
        username: handle || undefined,
        avatar: owner.avatar,
        bio: '',
        city: item.location?.city || '',
        neighborhood: owner.neighborhood || '',
        verified: owner.verified ?? true,
        rating: owner.rating || 5,
        reviewCount: owner.reviewCount || 0,
        memberSince: owner.memberSince || 'October 2026',
        followersCount: 0,
        followingCount: 0,
        uploadsCount: items.filter((i) => i.owner?.id === owner.id).length,
      });
    }
  });

  const list = Array.from(map.values());
  list.sort((a, b) => {
    const aExact = bareQ && (a.username || '').replace(/^@/, '') === bareQ ? 1 : 0;
    const bExact = bareQ && (b.username || '').replace(/^@/, '') === bareQ ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    if (a.uploadsCount !== b.uploadsCount) return b.uploadsCount - a.uploadsCount;
    return b.followersCount - a.followersCount;
  });
  return list;
}

/**
 * Fetch public creator profile along with followers and following lists
 */
export async function getPublicCreatorProfile(
  userId: string,
  items: Item[] = []
): Promise<{ profile: PublicUserProfile | null; followers: PublicUserProfile[]; following: PublicUserProfile[]; items: Item[] }> {
  try {
    const res = await fetch(`/api/users/public/${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.profile) {
        return {
          profile: data.profile,
          followers: Array.isArray(data.followers) ? data.followers : [],
          following: Array.isArray(data.following) ? data.following : [],
          items: Array.isArray(data.items) ? data.items : items.filter((i) => i.owner?.id === userId),
        };
      }
    }
  } catch (err) {
    console.warn('Public creator fetch notice:', err);
  }

  // Fallback from items
  const ownerItems = items.filter((i) => i.owner?.id === userId);
  const ownerItem = ownerItems[0];
  if (ownerItem?.owner) {
    return {
      profile: {
        id: ownerItem.owner.id,
        name: ownerItem.owner.name,
        username: normalizeUsernameHandle(ownerItem.owner.username) || undefined,
        avatar: ownerItem.owner.avatar,
        bio: '',
        city: ownerItem.location?.city || '',
        neighborhood: ownerItem.owner.neighborhood || '',
        verified: ownerItem.owner.verified ?? true,
        rating: ownerItem.owner.rating || 5,
        reviewCount: ownerItem.owner.reviewCount || 0,
        memberSince: ownerItem.owner.memberSince || 'October 2026',
        followersCount: 0,
        followingCount: 0,
        uploadsCount: ownerItems.length,
      },
      followers: [],
      following: [],
      items: ownerItems,
    };
  }

  return { profile: null, followers: [], following: [], items: [] };
}

/**
 * Toggle follow/unfollow for a creator across server database & Firestore
 */
export async function toggleFollowUser(
  currentUser: User,
  targetCreator: { id: string; name?: string; username?: string; avatar?: string },
  currentlyFollowing: boolean
): Promise<{ isFollowing: boolean; followingIds: string[]; targetFollowersCount?: number }> {
  const followId = `${currentUser.id}__${targetCreator.id}`;

  // 1. Persistent server follow toggle
  const res = await fetch('/api/follows/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      followerId: currentUser.id,
      targetUserId: targetCreator.id,
      followerName: currentUser.name,
      followerUsername: currentUser.username,
      followerAvatar: currentUser.avatar,
      targetName: targetCreator.name,
      targetUsername: targetCreator.username,
      targetAvatar: targetCreator.avatar,
    }),
  });
  const serverData = await res.json();
  if (!res.ok || !serverData.success) {
    throw new Error(serverData?.error || 'Could not update follow status.');
  }

  // 2. Mirror to Firestore follows collection
  try {
    const followRef = doc(db, 'follows', followId);
    if (currentlyFollowing) {
      await deleteDoc(followRef);
    } else {
      const payload: UserFollow = {
        id: followId,
        followerId: currentUser.id,
        followerName: (currentUser.name || 'Member').slice(0, 80),
        followerUsername: normalizeUsernameHandle(currentUser.username),
        followerAvatar: (currentUser.avatar || '').slice(0, 1000),
        followingId: targetCreator.id,
        followingName: (targetCreator.name || 'Creator').slice(0, 80),
        followingUsername: normalizeUsernameHandle(targetCreator.username),
        followingAvatar: (targetCreator.avatar || '').slice(0, 1000),
        createdAt: new Date().toISOString(),
      };
      await setDoc(followRef, cleanFirestoreData(payload));
    }
  } catch (err) {
    console.warn('Firestore follow sync notice:', err);
  }

  return {
    isFollowing: Boolean(serverData.isFollowing),
    followingIds: Array.isArray(serverData.followingIds) ? serverData.followingIds : [],
    targetFollowersCount: serverData.targetFollowersCount,
  };
}

/**
 * Subscribe to the current user's followingIds and followerIds
 */
export function subscribeToUserFollows(
  userId: string,
  onUpdate: (data: { followingIds: string[]; followerIds: string[] }) => void
) {
  let isMounted = true;

  const fetchFollows = async () => {
    try {
      const res = await fetch(`/api/follows?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (isMounted && data.success) {
        onUpdate({
          followingIds: Array.isArray(data.followingIds) ? data.followingIds : [],
          followerIds: Array.isArray(data.followerIds) ? data.followerIds : [],
        });
      }
    } catch {
      // ignore network notice
    }
  };

  fetchFollows();

  let unsubFirestore: () => void = () => {};
  try {
    const colRef = collection(db, 'follows');
    unsubFirestore = onSnapshot(
      colRef,
      (snap) => {
        if (!isMounted || snap.empty) return;
        const followingSet = new Set<string>();
        const followerSet = new Set<string>();
        snap.forEach((d) => {
          const f = d.data() as UserFollow;
          if (f.followerId === userId) followingSet.add(f.followingId);
          if (f.followingId === userId) followerSet.add(f.followerId);
        });
        if (followingSet.size > 0 || followerSet.size > 0) {
          onUpdate({
            followingIds: Array.from(followingSet),
            followerIds: Array.from(followerSet),
          });
        }
      },
      () => {
        // fallback to server polling already active below
      }
    );
  } catch {
    // ignore
  }

  const interval = setInterval(() => {
    if (isMounted) fetchFollows();
  }, 5000);

  return () => {
    isMounted = false;
    unsubFirestore();
    clearInterval(interval);
  };
}

/**
 * Notify all followers in Firestore when a creator uploads a new item (server API also handles DB persistence on POST /api/items)
 */
export async function notifyFollowersOfUploadInFirestore(item: Item): Promise<void> {
  try {
    const followsSnap = await getDocs(
      query(collection(db, 'follows'), where('followingId', '==', item.owner.id))
    );
    const promises: Promise<void>[] = [];
    followsSnap.forEach((d) => {
      const f = d.data() as UserFollow;
      if (f.followerId && f.followerId !== item.owner.id) {
        const notifId = `notif_${item.id}_${f.followerId}`;
        const notif: UploadNotification = {
          id: notifId,
          recipientId: f.followerId,
          creatorId: item.owner.id,
          creatorName: (item.owner.name || 'Creator').slice(0, 80),
          creatorUsername: normalizeUsernameHandle(item.owner.username),
          creatorAvatar: (item.owner.avatar || '').slice(0, 1000),
          itemId: item.id,
          itemTitle: item.title.slice(0, 160),
          itemImage: (item.images?.[0] || '').slice(0, 180000),
          itemCategory: item.category.slice(0, 64),
          priceRateText: (item.priceRateText || '').slice(0, 64),
          listingType: item.listingType,
          read: false,
          createdAt: item.createdAt || new Date().toISOString(),
        };
        promises.push(setDoc(doc(db, 'notifications', notifId), cleanFirestoreData(notif)));
      }
    });
    await Promise.allSettled(promises);
  } catch {
    // server POST /api/items already creates notifications persistently
  }
}

/**
 * Subscribe to upload update notifications for the signed-in user
 */
export function subscribeToUploadNotifications(
  userId: string,
  onUpdate: (notifications: UploadNotification[]) => void
) {
  let isMounted = true;
  let lastKey = '';

  const dispatch = (list: UploadNotification[]) => {
    if (!isMounted) return;
    const sorted = [...list].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    const key = sorted.map((n) => `${n.id}:${n.read}`).join('|');
    if (key !== lastKey) {
      lastKey = key;
      onUpdate(sorted);
    }
  };

  const fetchNotifs = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (isMounted && data.success && Array.isArray(data.notifications)) {
        dispatch(data.notifications);
      }
    } catch {
      // ignore
    }
  };

  fetchNotifs();

  let unsubFirestore: () => void = () => {};
  try {
    const q = query(collection(db, 'notifications'), where('recipientId', '==', userId));
    unsubFirestore = onSnapshot(
      q,
      (snap) => {
        if (!isMounted || snap.empty) return;
        const list: UploadNotification[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
        dispatch(list);
      },
      () => {
        // fallback polling handles updates
      }
    );
  } catch {
    // ignore
  }

  const interval = setInterval(() => {
    if (isMounted) fetchNotifs();
  }, 4000);

  return () => {
    isMounted = false;
    unsubFirestore();
    clearInterval(interval);
  };
}

/**
 * Mark upload notifications as read
 */
export async function markUploadNotificationsRead(
  userId: string,
  notificationId?: string
): Promise<void> {
  try {
    await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, notificationId }),
    });
  } catch (err) {
    console.warn('Notice marking notifications read:', err);
  }

  if (notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch {
      // ignore
    }
  }
}

/**
 * Check the database (both local persistent store and Firestore) to determine
 * whether a user is already authorized and registered.
 */
export async function checkUserRegistrationInDatabase(
  identifier: { email?: string; phoneNumber?: string; id?: string }
): Promise<{ registered: boolean; user?: Partial<User>; source?: 'firestore' | 'server' }> {
  const cleanEmail = identifier.email?.trim().toLowerCase();
  const cleanPhone = identifier.phoneNumber?.replace(/\s+/g, '');
  const cleanId = identifier.id?.trim();

  if (!cleanEmail && !cleanPhone && !cleanId) {
    return { registered: false };
  }

  // 1. Query persistent server database API
  try {
    const params = new URLSearchParams();
    if (cleanEmail) params.append('email', cleanEmail);
    if (cleanPhone) params.append('phoneNumber', cleanPhone);
    if (cleanId) params.append('id', cleanId);

    const res = await fetch(`/api/users/check?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.registered && data.user) {
        return { registered: true, user: data.user, source: 'server' };
      }
    }
  } catch (err) {
    console.warn('Server database user check notice:', err);
  }

  // 2. Query Firestore database
  try {
    if (cleanId) {
      const docSnap = await getDoc(doc(db, 'users', cleanId));
      if (docSnap.exists()) {
        return { registered: true, user: { id: docSnap.id, ...docSnap.data() }, source: 'firestore' };
      }
    }
    if (cleanEmail) {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, where('email', '==', cleanEmail));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const found = qSnap.docs[0];
        return { registered: true, user: { id: found.id, ...found.data() }, source: 'firestore' };
      }
    }
  } catch (firestoreErr) {
    console.warn('Firestore user check notice:', firestoreErr);
  }

  return { registered: false };
}

/**
 * Fetch a user profile from Firestore or persistent server database
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  // 1. Try persistent server database first for immediate response
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return data.user as User;
      }
    }
  } catch (err) {
    console.warn('Server database getUserProfile notice:', err);
  }

  // 2. Try Firestore with timeout fallback
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await Promise.race([
      getDoc(userRef),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    if (snap && snap.exists()) {
      return { id: snap.id, ...snap.data() } as User;
    }
  } catch (error) {
    console.warn('Firestore getUserProfile notice:', error);
  }

  return null;
}

/**
 * Real-time subscription to user profile
 */
export function subscribeToUserProfile(
  userId: string,
  onUpdate: (user: User | null) => void,
  onError?: (err: any) => void
) {
  try {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate({ id: snap.id, ...snap.data() } as User);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        console.warn('Error listening to user profile:', err);
        onError?.(err);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    return () => {};
  }
}

/**
 * Verify phone number and save status permanently to Firestore
 */
export async function verifyUserPhoneInFirestore(userId: string, phoneNumber: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const sanitized = cleanFirestoreData({
      phoneNumber,
      phoneVerified: true,
      phoneVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await setDoc(userRef, sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
}

/**
 * Subscribe to platform ratings & feedback reviews (Firestore + server fallback)
 */
export function subscribeToPlatformReviews(
  onUpdate: (reviews: PlatformReview[]) => void,
  onError?: (err: any) => void
) {
  let isMounted = true;
  let mergedMap = new Map<string, PlatformReview>();

  const emitSorted = () => {
    if (!isMounted) return;
    const sorted = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    onUpdate(sorted);
  };

  fetch('/api/reviews')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!isMounted || !data?.success || !Array.isArray(data.reviews)) return;
      data.reviews.forEach((rev: PlatformReview) => {
        if (rev?.id) mergedMap.set(rev.id, rev);
      });
      emitSorted();
    })
    .catch((err) => console.warn('Server reviews fetch notice:', err));

  let unsubFirestore: () => void = () => {};
  try {
    const colRef = collection(db, 'reviews');
    unsubFirestore = onSnapshot(
      colRef,
      (snapshot) => {
        if (!isMounted) return;
        snapshot.forEach((d) => {
          const data = d.data() as PlatformReview;
          mergedMap.set(d.id, { ...data, id: d.id });
        });
        emitSorted();
      },
      (err) => {
        console.warn('Firestore reviews sync notice:', err);
        onError?.(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to platform reviews:', err);
  }

  return () => {
    isMounted = false;
    unsubFirestore();
  };
}

/**
 * Save a user rating & feedback review to both server database and Firestore
 */
export async function createPlatformReviewInFirestore(review: PlatformReview): Promise<void> {
  const cleanAreas = Array.isArray(review.improvementAreas)
    ? review.improvementAreas
        .filter((a) => typeof a === 'string' && a.trim().length > 0)
        .map((a) => a.trim().slice(0, 60))
        .slice(0, 10)
    : [];

  const sanitized = cleanFirestoreData({
    id: review.id,
    rating: Math.min(5, Math.max(1, Math.round(Number(review.rating)))),
    comment: String(review.comment || '').trim().slice(0, 500),
    ...(cleanAreas.length > 0 ? { improvementAreas: cleanAreas } : {}),
    reviewerName: String(review.reviewerName || 'Community Member').trim().slice(0, 80) || 'Community Member',
    ...(review.userId ? { userId: String(review.userId).slice(0, 128) } : {}),
    createdAt: String(review.createdAt || new Date().toISOString()).slice(0, 64),
  });

  // 1. Persist to server database API
  try {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
  } catch (err) {
    console.warn('Notice saving review to server database:', err);
  }

  // 2. Persist to Firestore cloud database
  try {
    const docRef = doc(db, 'reviews', sanitized.id);
    await setDoc(docRef, sanitized);
  } catch (error) {
    console.warn('Notice saving review to Firestore:', error);
  }
}


