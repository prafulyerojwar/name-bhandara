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

  // Write the profile first, then return — the auth listener will read it
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
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;

  let profile = await getUserProfile(firebaseUser.uid);
  if (!profile) {
    profile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName ?? firebaseUser.email!.split('@')[0],
      role,
      ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
      createdAt: Date.now(),
    };
    await createUserProfile(profile);
  }
  return profile;
}

// Translate Firebase error codes into friendly messages
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please login.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in cancelled.',
  };
  return map[code] ?? (err instanceof Error ? err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim() : 'Something went wrong. Please try again.');
}
