'use client';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { useAuthStore } from '@/store/authStore';
import { UserProfile } from '@/types';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Retry up to 3 times with a short delay to handle the race condition
        // where onAuthStateChanged fires before createUserProfile finishes writing.
        let profile: UserProfile | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          profile = await getUserProfile(firebaseUser.uid);
          if (profile) break;
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        }

        if (profile) {
          setUser(profile);
        } else {
          // Absolute fallback: build a minimal profile from Firebase Auth data
          // so the user is not stuck in a logged-out state
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
            role: 'general',
            photoURL: firebaseUser.photoURL ?? undefined,
            createdAt: Date.now(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);
}
