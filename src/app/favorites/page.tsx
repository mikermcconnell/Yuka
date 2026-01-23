'use client';

import { Header, ProductCardSkeleton } from '@/components/layout';
import { ProductListItem } from '@/components/product';
import { Button } from '@/components/ui';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/lib/utils/formatters';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header title="Favorites" />
        <main className="px-4 py-6">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view favorites</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite products by signing in
            </p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Favorites" />

      <main className="px-4 py-6">
        {/* Header */}
        {favorites.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">{favorites.length} saved products</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600">
              Save products you love by tapping the heart icon
            </p>
          </div>
        )}

        {/* Favorites list */}
        {!loading && favorites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {favorites.map((entry) => (
              <div key={entry.barcode} className="px-4">
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3">
                  <span>Added {formatRelativeTime(entry.addedAt)}</span>
                </div>
                <ProductListItem
                  product={entry}
                  onDelete={() => removeFavorite(entry.barcode)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
