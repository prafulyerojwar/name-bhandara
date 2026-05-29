import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './firestore';
import { UserProfile, UserRole } from '@/types';

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  extra: Partial<UserProfile> = {}
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  const profile: UserProfile = {
    uid: cred.user.uid,
    email,
    displayName,
    role,
    createdAt: Date.now(),
    ...extra,
  };
  await createUserProfile(profile);
  return profile;
}

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return signOut(auth);
}

export async function signInWithGoogle(role: UserRole = 'general'): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  let profile = await getUserProfile(user.uid);
  if (!profile) {
    profile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      role,
      photoURL: user.photoURL || undefined,
      createdAt: Date.now(),
    };
    await createUserProfile(profile);
  }
  return profile;
}
