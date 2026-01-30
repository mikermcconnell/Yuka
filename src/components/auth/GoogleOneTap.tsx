'use client';

import { useEffect, useCallback, useRef } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleOneTapConfig) => void;
          prompt: (callback?: (notification: PromptNotification) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
  itp_support?: boolean;
  use_fedcm_for_prompt?: boolean;
}

interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface PromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

export default function GoogleOneTap() {
  const { user, loading } = useAuth();
  const initialized = useRef(false);

  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    if (!isFirebaseConfigured) return;

    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      const result = await signInWithCredential(auth(), credential);

      // Create or update user in Firestore
      const firebaseUser = result.user;
      const userRef = doc(db(), 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: serverTimestamp(),
        createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
      }, { merge: true });

      // Page will automatically update via onAuthStateChanged
    } catch (error) {
      console.error('One-Tap sign-in error:', error);
    }
  }, []);

  useEffect(() => {
    // Don't show if user is already signed in or still loading
    if (loading || user || initialized.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Google Client ID not configured for One-Tap');
      return;
    }

    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && !user) {
        initialized.current = true;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: true, // Automatically sign in if only one account
          cancel_on_tap_outside: false,
          context: 'signin',
          itp_support: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log('One-Tap not displayed:', notification.getNotDisplayedReason());
          }
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
      // Don't remove script on cleanup to avoid re-loading issues
    };
  }, [user, loading, handleCredentialResponse]);

  // This component doesn't render anything - One-Tap shows as an overlay
  return null;
}
