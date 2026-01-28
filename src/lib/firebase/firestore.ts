import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { safeFirestoreOperation } from './errors';
import { Product, HistoryEntry, FavoriteEntry, ProductList, ProductRating } from '@/types';
import { BeerLog, BeerType } from '@/types/beers';
import { PINT_OUNCES, CAN_OUNCES } from '@/lib/beers/constants';
import { formatDateString } from '@/lib/beers/calculations';

// History functions
export async function addToHistory(
  userId: string,
  product: Product
): Promise<string> {
  return safeFirestoreOperation(async () => {
    const historyRef = collection(db(), 'users', userId, 'history');
    const docRef = doc(historyRef);

    const entry = {
      barcode: product.barcode,
      productName: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      healthScore: product.healthScore,
      nutritionGrade: product.nutritionGrade,
      scannedAt: serverTimestamp(),
    };

    await setDoc(docRef, entry);
    return docRef.id;
  }, 'addToHistory');
}

export async function getHistory(
  userId: string,
  limitCount: number = 50
): Promise<HistoryEntry[]> {
  return safeFirestoreOperation(async () => {
    const historyRef = collection(db(), 'users', userId, 'history');
    const q = query(historyRef, orderBy('scannedAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        barcode: data.barcode,
        productName: data.productName,
        brand: data.brand,
        imageUrl: data.imageUrl,
        healthScore: data.healthScore,
        nutritionGrade: data.nutritionGrade,
        scannedAt: (data.scannedAt as Timestamp)?.toDate() || new Date(),
      };
    });
  }, 'getHistory');
}

export async function deleteHistoryEntry(
  userId: string,
  entryId: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const entryRef = doc(db(), 'users', userId, 'history', entryId);
    await deleteDoc(entryRef);
  }, 'deleteHistoryEntry');
}

export async function clearHistory(userId: string): Promise<void> {
  return safeFirestoreOperation(async () => {
    const historyRef = collection(db(), 'users', userId, 'history');
    const snapshot = await getDocs(historyRef);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }, 'clearHistory');
}

// Favorites functions
export async function addToFavorites(
  userId: string,
  product: Product
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const favoriteRef = doc(db(), 'users', userId, 'favorites', product.barcode);

    const entry = {
      barcode: product.barcode,
      productName: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      healthScore: product.healthScore,
      nutritionGrade: product.nutritionGrade,
      addedAt: serverTimestamp(),
    };

    await setDoc(favoriteRef, entry);
  }, 'addToFavorites');
}

export async function removeFromFavorites(
  userId: string,
  barcode: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const favoriteRef = doc(db(), 'users', userId, 'favorites', barcode);
    await deleteDoc(favoriteRef);
  }, 'removeFromFavorites');
}

export async function getFavorites(userId: string): Promise<FavoriteEntry[]> {
  return safeFirestoreOperation(async () => {
    const favoritesRef = collection(db(), 'users', userId, 'favorites');
    const q = query(favoritesRef, orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        barcode: data.barcode,
        productName: data.productName,
        brand: data.brand,
        imageUrl: data.imageUrl,
        healthScore: data.healthScore,
        nutritionGrade: data.nutritionGrade,
        addedAt: (data.addedAt as Timestamp)?.toDate() || new Date(),
      };
    });
  }, 'getFavorites');
}

export async function isFavorite(
  userId: string,
  barcode: string
): Promise<boolean> {
  return safeFirestoreOperation(async () => {
    const favoriteRef = doc(db(), 'users', userId, 'favorites', barcode);
    const snapshot = await getDoc(favoriteRef);
    return snapshot.exists();
  }, 'isFavorite');
}

// Lists functions
export async function createList(
  userId: string,
  name: string,
  description?: string
): Promise<string> {
  return safeFirestoreOperation(async () => {
    const listsRef = collection(db(), 'users', userId, 'lists');
    const docRef = doc(listsRef);

    const list: Omit<ProductList, 'id' | 'createdAt' | 'updatedAt'> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      name,
      description,
      products: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, list);
    return docRef.id;
  }, 'createList');
}

export async function getLists(userId: string): Promise<ProductList[]> {
  return safeFirestoreOperation(async () => {
    const listsRef = collection(db(), 'users', userId, 'lists');
    const q = query(listsRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        products: data.products || [],
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
      };
    });
  }, 'getLists');
}

export async function getList(
  userId: string,
  listId: string
): Promise<ProductList | null> {
  return safeFirestoreOperation(async () => {
    const listRef = doc(db(), 'users', userId, 'lists', listId);
    const snapshot = await getDoc(listRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
      products: data.products || [],
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  }, 'getList');
}

export async function addToList(
  userId: string,
  listId: string,
  barcode: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const listRef = doc(db(), 'users', userId, 'lists', listId);
    await updateDoc(listRef, {
      products: arrayUnion(barcode),
      updatedAt: serverTimestamp(),
    });
  }, 'addToList');
}

export async function removeFromList(
  userId: string,
  listId: string,
  barcode: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const listRef = doc(db(), 'users', userId, 'lists', listId);
    await updateDoc(listRef, {
      products: arrayRemove(barcode),
      updatedAt: serverTimestamp(),
    });
  }, 'removeFromList');
}

export async function deleteList(userId: string, listId: string): Promise<void> {
  return safeFirestoreOperation(async () => {
    const listRef = doc(db(), 'users', userId, 'lists', listId);
    await deleteDoc(listRef);
  }, 'deleteList');
}

export async function updateListName(
  userId: string,
  listId: string,
  name: string,
  description?: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const listRef = doc(db(), 'users', userId, 'lists', listId);
    await updateDoc(listRef, {
      name,
      description,
      updatedAt: serverTimestamp(),
    });
  }, 'updateListName');
}

// Ratings functions
export async function setRating(
  userId: string,
  barcode: string,
  rating: number,
  notes?: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const ratingRef = doc(db(), 'users', userId, 'ratings', barcode);
    const existing = await getDoc(ratingRef);

    const ratingData = {
      barcode,
      rating,
      notes,
      createdAt: existing.exists()
        ? existing.data().createdAt
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ratingRef, ratingData);
  }, 'setRating');
}

export async function getRating(
  userId: string,
  barcode: string
): Promise<ProductRating | null> {
  return safeFirestoreOperation(async () => {
    const ratingRef = doc(db(), 'users', userId, 'ratings', barcode);
    const snapshot = await getDoc(ratingRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      barcode: data.barcode,
      rating: data.rating,
      notes: data.notes,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    };
  }, 'getRating');
}

export async function deleteRating(
  userId: string,
  barcode: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const ratingRef = doc(db(), 'users', userId, 'ratings', barcode);
    await deleteDoc(ratingRef);
  }, 'deleteRating');
}

// Beer log functions
export async function addBeerLog(
  userId: string,
  type: BeerType
): Promise<string> {
  return safeFirestoreOperation(async () => {
    const beerLogsRef = collection(db(), 'users', userId, 'beerLogs');
    const docRef = doc(beerLogsRef);

    const now = new Date();
    const dateStr = formatDateString(now);
    const ounces = type === 'pint' ? PINT_OUNCES : CAN_OUNCES;

    const entry = {
      date: dateStr,
      type,
      ounces,
      timestamp: serverTimestamp(),
    };

    await setDoc(docRef, entry);
    return docRef.id;
  }, 'addBeerLog');
}

export async function deleteBeerLog(
  userId: string,
  logId: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const logRef = doc(db(), 'users', userId, 'beerLogs', logId);
    await deleteDoc(logRef);
  }, 'deleteBeerLog');
}

export async function getBeerLogsForDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<BeerLog[]> {
  return safeFirestoreOperation(async () => {
    const beerLogsRef = collection(db(), 'users', userId, 'beerLogs');
    const q = query(
      beerLogsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc'),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date,
        type: data.type as BeerType,
        ounces: data.ounces,
        timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
      };
    });
  }, 'getBeerLogsForDateRange');
}
