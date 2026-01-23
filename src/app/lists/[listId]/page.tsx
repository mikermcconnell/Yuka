'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, ProductCardSkeleton } from '@/components/layout';
import { ProductCard } from '@/components/product';
import { Button, ConfirmModal } from '@/components/ui';
import { useLists } from '@/hooks/useLists';
import { useProduct } from '@/hooks/useProduct';
import { useAuth } from '@/hooks/useAuth';
import { ProductList, Product } from '@/types';

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.listId as string;
  const { user } = useAuth();
  const { getListById, removeProductFromList, deleteListById } = useLists();
  const { fetchProductByBarcode } = useProduct();

  const [list, setList] = useState<ProductList | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      if (!user || !listId) return;

      setLoading(true);
      try {
        const fetchedList = await getListById(listId);
        setList(fetchedList);

        if (fetchedList && fetchedList.products.length > 0) {
          // Fetch product details for each barcode
          const productPromises = fetchedList.products.map((barcode) =>
            fetchProductByBarcode(barcode).catch(() => null)
          );
          const fetchedProducts = await Promise.all(productPromises);
          setProducts(fetchedProducts.filter((p): p is Product => p !== null));
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [user, listId, getListById, fetchProductByBarcode]);

  const handleRemoveProduct = async (barcode: string) => {
    if (!user || !listId) return;

    try {
      await removeProductFromList(listId, barcode);
      setProducts((prev) => prev.filter((p) => p.barcode !== barcode));
      setList((prev) =>
        prev ? { ...prev, products: prev.products.filter((b) => b !== barcode) } : null
      );
    } catch {
      // Handle error
    }
  };

  const handleDeleteList = async () => {
    if (!user || !listId) return;

    setDeleting(true);
    try {
      await deleteListById(listId);
      router.push('/lists');
    } catch {
      // Handle error
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header title="List" showBack />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-600">Please sign in to view this list</p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Loading..." showBack />
        <main className="px-4 py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen">
        <Header title="List Not Found" showBack />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-600">This list could not be found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={list.name} showBack />

      <main className="px-4 py-6">
        {/* List info */}
        {list.description && (
          <p className="text-gray-600 mb-4">{list.description}</p>
        )}

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">{products.length} products</p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Delete List
          </button>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">List is empty</h2>
            <p className="text-gray-600 mb-6">
              Scan products and add them to this list
            </p>
            <Button onClick={() => router.push('/')}>
              Scan Products
            </Button>
          </div>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.barcode} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveProduct(product.barcode)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  aria-label="Remove from list"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteList}
          title="Delete List"
          message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
          loading={deleting}
        />
      </main>
    </div>
  );
}
