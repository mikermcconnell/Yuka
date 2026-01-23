'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/types';
import { fetchProduct, searchProducts } from '@/lib/api/openFoodFacts';
import { getErrorMessage } from '@/lib/utils/formatters';

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  fetchProductByBarcode: (barcode: string) => Promise<Product | null>;
  clearProduct: () => void;
}

export function useProduct(): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProductByBarcode = useCallback(async (barcode: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setProduct(null);

    try {
      const result = await fetchProduct(barcode);
      if (result) {
        setProduct(result);
        return result;
      } else {
        setNotFound(true);
        return null;
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch product'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProduct = useCallback(() => {
    setProduct(null);
    setError(null);
    setNotFound(false);
  }, []);

  return {
    product,
    loading,
    error,
    notFound,
    fetchProductByBarcode,
    clearProduct,
  };
}

interface UseProductSearchReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  search: (query: string, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
}

export function useProductSearch(): UseProductSearchReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');

  const search = useCallback(async (query: string, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchProducts(query, page);
      if (page === 1) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }
      setTotalCount(result.count);
      setCurrentPage(page);
      setCurrentQuery(query);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to search products'));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (currentQuery && !loading) {
      await search(currentQuery, currentPage + 1);
    }
  }, [currentQuery, currentPage, loading, search]);

  const clearSearch = useCallback(() => {
    setProducts([]);
    setTotalCount(0);
    setCurrentPage(1);
    setCurrentQuery('');
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    totalCount,
    currentPage,
    search,
    loadMore,
    clearSearch,
  };
}
