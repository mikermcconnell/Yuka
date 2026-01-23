'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProductList } from '@/types';
import {
  createList,
  getLists,
  getList,
  addToList,
  removeFromList,
  deleteList,
  updateListName,
} from '@/lib/firebase/firestore';
import { getErrorMessage } from '@/lib/utils/formatters';
import { useAuth } from './useAuth';

interface UseListsReturn {
  lists: ProductList[];
  loading: boolean;
  error: string | null;
  createNewList: (name: string, description?: string) => Promise<string>;
  deleteListById: (listId: string) => Promise<void>;
  updateList: (listId: string, name: string, description?: string) => Promise<void>;
  addProductToList: (listId: string, barcode: string) => Promise<void>;
  removeProductFromList: (listId: string, barcode: string) => Promise<void>;
  getListById: (listId: string) => Promise<ProductList | null>;
  refresh: () => Promise<void>;
}

export function useLists(): UseListsReturn {
  const { user } = useAuth();
  const [lists, setLists] = useState<ProductList[]>([]);
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

  const fetchLists = useCallback(async () => {
    if (!user) {
      setLists([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userLists = await getLists(user.uid);
      if (mountedRef.current) {
        setLists(userLists);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(getErrorMessage(err, 'Failed to fetch lists'));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createNewList = useCallback(async (name: string, description?: string): Promise<string> => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      const listId = await createList(user.uid, name, description);
      const newList: ProductList = {
        id: listId,
        name,
        description,
        products: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setLists((prev) => [newList, ...prev]);
      return listId;
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create list'));
      throw err;
    }
  }, [user]);

  const deleteListById = useCallback(async (listId: string) => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await deleteList(user.uid, listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete list'));
      throw err;
    }
  }, [user]);

  const updateListById = useCallback(async (listId: string, name: string, description?: string) => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await updateListName(user.uid, listId, name, description);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, name, description, updatedAt: new Date() }
            : list
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update list'));
      throw err;
    }
  }, [user]);

  const addProductToList = useCallback(async (listId: string, barcode: string) => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await addToList(user.uid, listId, barcode);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                products: [...list.products, barcode],
                updatedAt: new Date(),
              }
            : list
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to add product to list'));
      throw err;
    }
  }, [user]);

  const removeProductFromList = useCallback(async (listId: string, barcode: string) => {
    if (!user) {
      throw new Error('Must be logged in');
    }

    try {
      await removeFromList(user.uid, listId, barcode);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                products: list.products.filter((b) => b !== barcode),
                updatedAt: new Date(),
              }
            : list
        )
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to remove product from list'));
      throw err;
    }
  }, [user]);

  const getListById = useCallback(async (listId: string): Promise<ProductList | null> => {
    if (!user) return null;
    return getList(user.uid, listId);
  }, [user]);

  return {
    lists,
    loading,
    error,
    createNewList,
    deleteListById,
    updateList: updateListById,
    addProductToList,
    removeProductFromList,
    getListById,
    refresh: fetchLists,
  };
}
