'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header, LoadingSpinner } from '@/components/layout';
import { BarcodeScanner, ManualEntry } from '@/components/scanner';
import { useProduct } from '@/hooks/useProduct';
import { useHistory } from '@/hooks/useHistory';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchProductByBarcode, loading, error } = useProduct();
  const { addProduct } = useHistory();
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');

  const handleScan = useCallback(
    async (barcode: string) => {
      setScannerError(null);
      const product = await fetchProductByBarcode(barcode);

      if (product) {
        // Save to history if logged in
        if (user) {
          try {
            await addProduct(product);
          } catch {
            // Silently fail history save
          }
        }
        // Navigate to product page
        router.push(`/product/${barcode}`);
      }
    },
    [fetchProductByBarcode, router, user, addProduct]
  );

  const handleScannerError = useCallback((err: string) => {
    setScannerError(err);
  }, []);

  return (
    <div className="min-h-screen">
      <Header title="Scan Product" />

      <main className="px-4 py-6">
        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'scan'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Camera Scan
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Enter Code
          </button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner size="lg" message="Fetching product..." />
          </div>
        )}

        {/* Error display */}
        {(error || scannerError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              {error || scannerError}
            </p>
            {error?.includes('not found') && (
              <p className="text-red-600 text-xs mt-1">
                This product may not be in the Open Food Facts database yet.
              </p>
            )}
          </div>
        )}

        {/* Scanner or Manual Entry */}
        {mode === 'scan' ? (
          <BarcodeScanner onScan={handleScan} onError={handleScannerError} />
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <ManualEntry onSubmit={handleScan} loading={loading} />
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Tips for better scanning:</h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Hold your phone steady over the barcode
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Make sure there&apos;s good lighting
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              Keep the barcode flat and unobstructed
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              If scanning fails, try manual entry
            </li>
          </ul>
        </div>

        {/* Test barcodes for development */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Test Barcodes:</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>
              <button
                onClick={() => handleScan('3017620422003')}
                className="text-green-600 hover:underline"
              >
                3017620422003
              </button>{' '}
              - Nutella
            </p>
            <p>
              <button
                onClick={() => handleScan('5449000000996')}
                className="text-green-600 hover:underline"
              >
                5449000000996
              </button>{' '}
              - Coca-Cola
            </p>
            <p>
              <button
                onClick={() => handleScan('7622210449283')}
                className="text-green-600 hover:underline"
              >
                7622210449283
              </button>{' '}
              - Oreo
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
