import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Bhandara, UserProfile, Booking } from '@/types';

// Users
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  const { setDoc } = await import('firebase/firestore');
  const ref = doc(db, 'users', profile.uid);
  await setDoc(ref, profile as unknown as Record<string, unknown>, { merge: true });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>);
}

// Bhandaras
export async function createBhandara(data: Omit<Bhandara, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'bhandaras'), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function getBhandara(id: string): Promise<Bhandara | null> {
  const snap = await getDoc(doc(db, 'bhandaras', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Bhandara) : null;
}

export async function updateBhandara(id: string, data: Partial<Bhandara>): Promise<void> {
  await updateDoc(doc(db, 'bhandaras', id), {
    ...data,
    updatedAt: Date.now(),
  } as Record<string, unknown>);
}

export async function getPublicBhandaras(city?: string): Promise<Bhandara[]> {
  let q = query(
    collection(db, 'bhandaras'),
    where('isPublic', '==', true),
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  if (city) {
    q = query(
      collection(db, 'bhandaras'),
      where('isPublic', '==', true),
      where('status', '==', 'available'),
      where('city', '==', city),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara));
}

export async function getPrivateBhandaras(city?: string): Promise<Bhandara[]> {
  let q = query(
    collection(db, 'bhandaras'),
    where('isPublic', '==', false),
    where('status', 'in', ['available', 'booked']),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  if (city) {
    q = query(
      collection(db, 'bhandaras'),
      where('isPublic', '==', false),
      where('status', 'in', ['available', 'booked']),
      where('city', '==', city),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara));
}

export async function getDonorBhandaras(donorId: string): Promise<Bhandara[]> {
  const q = query(
    collection(db, 'bhandaras'),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara));
}

// Bookings
export async function createBooking(data: Omit<Booking, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...data,
    createdAt: Date.now(),
  });
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function getBookingsByNgo(ngoId: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('ngoId', '==', ngoId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
}

export async function updateBooking(id: string, data: Partial<Booking>): Promise<void> {
  await updateDoc(doc(db, 'bookings', id), data as Record<string, unknown>);
}

export function subscribeToBhandaras(
  city: string | undefined,
  isPublic: boolean,
  callback: (bhandaras: Bhandara[]) => void
) {
  const conditions = [
    where('isPublic', '==', isPublic),
    where('status', '==', 'available'),
  ];
  if (city) conditions.push(where('city', '==', city));

  const q = query(collection(db, 'bhandaras'), ...conditions, orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara)));
  });
}
