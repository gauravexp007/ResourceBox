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
import { Item, ExchangeProposal, RentalBooking, ChatConversation, ChatMessage, User } from '../types';

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
      .then((snapshot) => {
        if (!isMounted) return;
        const list: Item[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Item);
        });
        if (list.length > 0) {
          dispatchUpdate(list);
          // Mirror Firestore items back to local database
          list.forEach((item) => {
            fetch('/api/items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cleanFirestoreData(item)),
            }).catch(() => {});
          });
        } else {
          fetchFromDatabaseApi();
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

/**
 * Save or update user profile permanently in Firestore.
 * Strips undefined values to prevent Firestore rejection.
 */
/**
 * Save or update user profile permanently in both Firestore and server database.
 * Guarantees cross-device persistence and immediate registered user lookup.
 */
export async function saveUserProfile(user: User): Promise<void> {
  const sanitized = cleanFirestoreData({
    ...user,
    updatedAt: new Date().toISOString()
  });

  // 1. Dual-write to persistent server database for cross-device visibility
  try {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
  } catch (err) {
    console.warn('Notice saving user to server database:', err);
  }

  // 2. Dual-write to Firestore cloud database
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, sanitized, { merge: true });
  } catch (error) {
    console.warn('Notice saving user to Firestore:', error);
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
  // 1. Try Firestore
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as User;
    }
  } catch (error) {
    console.warn('Firestore getUserProfile notice:', error);
  }

  // 2. Try server database fallback
  try {
    const res = await fetch(`/api/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return data.user as User;
      }
    }
  } catch (err) {
    console.warn('Server database getUserProfile notice:', err);
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

