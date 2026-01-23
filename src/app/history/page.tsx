'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, ProductCardSkeleton } from '@/components/layout';
import { ProductListItem } from '@/components/product';
import { Button, ConfirmModal } from '@/components/ui';
import { useHistory } from '@/hooks/useHistory';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime, getErrorMessage } from '@/lib/utils/formatters';

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { history, loading, removeEntry, clearAll } = useHistory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleClearAll = async () => {
    setClearing(true);
    setActionError(null);
    try {
      await clearAll();
      setShowClearConfirm(false);
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to clear history. Please try again.'));
    } finally {
      setClearing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header title="History" />
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view history</h2>
            <p className="text-gray-600 mb-6">
              Your scan history will be saved when you sign in
            </p>
            <Button onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Scan History" />

      <main className="px-4 py-6">
        {/* Error display */}
        {actionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{actionError}</p>
            <button
              onClick={() => setActionError(null)}
              className="text-red-600 text-xs mt-1 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header with clear button */}
        {history.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{history.length} items</p>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
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
        {!loading && history.length === 0 && (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No history yet</h2>
            <p className="text-gray-600">
              Start scanning products to build your history
            </p>
          </div>
        )}

        {/* History list */}
        {!loading && history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {history.map((entry) => (
              <div key={entry.id} className="px-4">
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3">
                  <span>{formatRelativeTime(entry.scannedAt)}</span>
                </div>
                <ProductListItem
                  product={entry}
                  onDelete={() => removeEntry(entry.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Clear confirmation modal */}
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearAll}
          title="Clear History"
          message="Are you sure you want to clear all scan history? This action cannot be undone."
          confirmText="Clear All"
          variant="danger"
          loading={clearing}
        />
      </main>
    </div>
  );
}
