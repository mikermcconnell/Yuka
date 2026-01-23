'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Product, HistoryEntry } from '@/types';
import { addToHistory, getHistory, deleteHistoryEntry, clearHistory } from '@/lib/firebase/firestore';
import { getErrorMessage } from '@/lib/utils/formatters';
import { useAuth } from './useAuth';

interface UseHistoryReturn {
  history: HistoryEntry[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
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

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const entries = await getHistory(user.uid);
      if (mountedRef.current) {
        setHistory(entries);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, 'Failed to fetch history'));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const addProduct = useCallback(async (product: Product) => {
    if (!user) {
      throw new Error('Must be logged in to save history');
    }

    try {
      const id = await addToHistory(user.uid, product);
      const newEntry: HistoryEntry = {
        id,
        barcode: product.barcode,
        productName: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        healthScore: product.healthScore,
        nutritionGrade: product.nutritionGrade,
        scannedAt: new Date(),
      };
      setHistory((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to add to history'));
      throw err;
    }
  }, [user]);

  const removeEntry = useCallback(async (entryId: string) => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await deleteHistoryEntry(user.uid, entryId);
      setHistory((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to remove entry'));
      throw err;
    }
  }, [user]);

  const clearAll = useCallback(async () => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await clearHistory(user.uid);
      setHistory([]);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to clear history'));
      throw err;
    }
  }, [user]);

  return {
    history,
    loading,
    error,
    addProduct,
    removeEntry,
    clearAll,
    refresh: fetchHistory,
  };
}
