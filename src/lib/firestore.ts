import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Bhandara, UserProfile, Booking } from '@/types';

// ── Users ────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// Firestore rejects fields with value `undefined` — strip them before writing
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', profile.uid), stripUndefined(profile), { merge: true });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), stripUndefined(data) as Record<string, unknown>);
}

// ── Bhandaras ────────────────────────────────────────────────────────────────

export async function createBhandara(data: Omit<Bhandara, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'bhandaras'), data);
  // Write the auto-generated id back into the document
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
  const constraints = city
    ? [where('isPublic', '==', true), where('status', '==', 'available'), where('city', '==', city), orderBy('createdAt', 'desc'), limit(50)]
    : [where('isPublic', '==', true), where('status', '==', 'available'), orderBy('createdAt', 'desc'), limit(50)];
  const snap = await getDocs(query(collection(db, 'bhandaras'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara));
}

export async function getPrivateBhandaras(city?: string): Promise<Bhandara[]> {
  const constraints = city
    ? [where('isPublic', '==', false), where('status', 'in', ['available', 'booked']), where('city', '==', city), orderBy('createdAt', 'desc'), limit(50)]
    : [where('isPublic', '==', false), where('status', 'in', ['available', 'booked']), orderBy('createdAt', 'desc'), limit(50)];
  const snap = await getDocs(query(collection(db, 'bhandaras'), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara));
}

export async function getDonorBhandaras(donorId: string): Promise<Bhandara[]> {
  const snap = await getDocs(
    query(collection(db, 'bhandaras'), where('donorId', '==', donorId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara));
}

// ── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking(data: Omit<Booking, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'bookings'), data);
  await updateDoc(ref, { id: ref.id });
  return ref.id;
}

export async function getBookingsByNgo(ngoId: string): Promise<Booking[]> {
  const snap = await getDocs(
    query(collection(db, 'bookings'), where('ngoId', '==', ngoId), orderBy('createdAt', 'desc'))
  );
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
  const constraints = [
    where('isPublic', '==', isPublic),
    where('status', '==', 'available'),
    ...(city ? [where('city', '==', city)] : []),
    orderBy('createdAt', 'desc'),
    limit(100),
  ];
  const q = query(collection(db, 'bhandaras'), ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Bhandara)));
  });
}
