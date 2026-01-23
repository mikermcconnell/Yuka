import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User | null> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured');
  }

  try {
    const result = await signInWithPopup(auth(), googleProvider);
    const firebaseUser = result.user;

    // Create or update user document in Firestore
    const user = await createOrUpdateUser(firebaseUser);
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
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

  return onAuthStateChanged(auth(), async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await getUserFromFirestore(firebaseUser.uid);
        // If user document doesn't exist in Firestore, create a basic user object
        // from Firebase Auth data to prevent stuck loading state
        if (user) {
          callback(user);
        } else {
          // User is authenticated but no Firestore doc yet - create minimal user
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Error fetching user from Firestore:', error);
        // On error, still provide basic user info from Firebase Auth
        // to prevent app from being stuck in loading state
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date(),
        });
      }
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

async function getUserFromFirestore(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db(), 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data();
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    return null;
  }
}

export function getCurrentUser(): FirebaseUser | null {
  if (!isFirebaseConfigured) {
    return null;
  }
  return auth().currentUser;
}
