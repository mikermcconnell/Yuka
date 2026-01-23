'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Product, FavoriteEntry } from '@/types';
import { addToFavorites, removeFromFavorites, getFavorites, isFavorite } from '@/lib/firebase/firestore';
import { getErrorMessage } from '@/lib/utils/formatters';
import { useAuth } from './useAuth';

interface UseFavoritesReturn {
  favorites: FavoriteEntry[];
  loading: boolean;
  error: string | null;
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (barcode: string) => Promise<void>;
  toggleFavorite: (product: Product) => Promise<boolean>;
  checkIsFavorite: (barcode: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track mounted state to prevent state updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const entries = await getFavorites(user.uid);
      if (mountedRef.current) {
        setFavorites(entries);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, 'Failed to fetch favorites'));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (product: Product) => {
    if (!user) {
      throw new Error('Must be logged in to save favorites');
    }

    try {
      await addToFavorites(user.uid, product);
      const newEntry: FavoriteEntry = {
        barcode: product.barcode,
        productName: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        healthScore: product.healthScore,
        nutritionGrade: product.nutritionGrade,
        addedAt: new Date(),
      };
      setFavorites((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to add favorite'));
      throw err;
    }
  }, [user]);

  const removeFavorite = useCallback(async (barcode: string) => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await removeFromFavorites(user.uid, barcode);
      setFavorites((prev) => prev.filter((entry) => entry.barcode !== barcode));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to remove favorite'));
      throw err;
    }
  }, [user]);

  const toggleFavorite = useCallback(async (product: Product): Promise<boolean> => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    const isFav = favorites.some((f) => f.barcode === product.barcode);
    if (isFav) {
      await removeFavorite(product.barcode);
      return false;
    } else {
      await addFavorite(product);
      return true;
    }
  }, [user, favorites, addFavorite, removeFavorite]);

  const checkIsFavorite = useCallback(async (barcode: string): Promise<boolean> => {
    if (!user) return false;
    return isFavorite(user.uid, barcode);
  }, [user]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    checkIsFavorite,
    refresh: fetchFavorites,
  };
}
