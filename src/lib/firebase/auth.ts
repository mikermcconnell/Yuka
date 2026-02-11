import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export async function signInWithGoogle(): Promise<User | null> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured');
  }

  // On mobile, use redirect flow to avoid popup/COOP issues
  if (isMobile()) {
    await signInWithRedirect(auth(), googleProvider);
    // Page will redirect — this won't resolve until the user comes back
    return null;
  }

  try {
    const result = await signInWithPopup(auth(), googleProvider);
    const firebaseUser = result.user;

    // Fire-and-forget: update Firestore in background (don't block sign-in)
    createOrUpdateUser(firebaseUser).catch((error) => {
      console.error('Error creating/updating user document:', error);
    });

    // Return immediately with basic user info from Firebase Auth
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function handleRedirectResult(): Promise<void> {
  if (!isFirebaseConfigured) return;

  try {
    const result = await getRedirectResult(auth());
    if (result?.user) {
      createOrUpdateUser(result.user).catch((error) => {
        console.error('Error creating/updating user document:', error);
      });
    }
  } catch (error) {
    console.error('Error handling redirect result:', error);
  }
}

export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured) {
    return;
  }

  try {
    await firebaseSignOut(auth());
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured) {
    // Return a no-op unsubscribe function if Firebase isn't configured
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth(), (firebaseUser) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: firebaseUser.metadata.creationTime
          ? new Date(firebaseUser.metadata.creationTime)
          : new Date(),
      });
    } else {
      callback(null);
    }
  });
}

async function createOrUpdateUser(firebaseUser: FirebaseUser): Promise<User> {
  const userRef = doc(db(), 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  const userData: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    createdAt: userSnap.exists()
      ? userSnap.data().createdAt?.toDate() || new Date()
      : new Date(),
  };

  await setDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp(),
    createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp(),
  }, { merge: true });

  return userData;
}


export function getCurrentUser(): FirebaseUser | null {
  if (!isFirebaseConfigured) {
    return null;
  }
  return auth().currentUser;
}
