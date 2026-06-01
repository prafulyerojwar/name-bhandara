import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
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

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // If the Firestore profile is missing (orphaned from a previous failed
  // registration) build a minimal one so the user isn't stuck.
  let profile = await getUserProfile(cred.user.uid);
  if (!profile) {
    profile = {
      uid: cred.user.uid,
      email: cred.user.email!,
      displayName: cred.user.displayName ?? email.split('@')[0],
      role: 'general',
      createdAt: Date.now(),
    };
    await createUserProfile(profile);
  }
  return profile;
}

export async function logoutUser() {
  return signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
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

// Maps Firebase error codes to plain human-readable messages
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/email-already-in-use':    'This email is already registered. Please login or reset your password.',
    'auth/invalid-email':           'Invalid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Use "Forgot password?" to reset it.',
    'auth/invalid-credential':      'Incorrect email or password. Use "Forgot password?" if needed.',
    'auth/operation-not-allowed':   'Email/Password sign-in is not enabled. Please contact support.',
    'auth/too-many-requests':       'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed':  'Network error. Check your connection and try again.',
    'auth/popup-closed-by-user':    'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in cancelled.',
    'auth/user-disabled':           'This account has been disabled.',
  };
  return (
    map[code] ??
    (err instanceof Error
      ? err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim()
      : 'Something went wrong. Please try again.')
  );
}
