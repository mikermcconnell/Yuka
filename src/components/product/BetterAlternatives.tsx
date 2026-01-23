'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Alternative, fetchBetterAlternatives } from '@/lib/alternatives';
import { getScoreColor } from '@/lib/scoring';

interface BetterAlternativesProps {
  product: Product;
}

export default function BetterAlternatives({ product }: BetterAlternativesProps) {
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track mounted state and prevent state updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const loadAlternatives = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchBetterAlternatives(product, 5);
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setAlternatives(results);
        }
      } catch (err) {
        console.error('Failed to load alternatives:', err);
        if (mountedRef.current) {
          setError('Failed to load alternatives');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadAlternatives();

    return () => {
      mountedRef.current = false;
    };
    // Using stable primitives instead of product object to prevent infinite re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.barcode, product.healthScore, product.categories]);

  // Don't show section if product already has a great score
  if (product.healthScore >= 75 && !loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Better Alternatives</h3>
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-800">Great choice!</p>
            <p className="text-sm text-green-700">This product already scores well.</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Better Alternatives</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return null; // Silently fail - don't show broken section
  }

  // No categories to search
  if (!product.categories || product.categories.length === 0) {
    return null;
  }

  // No alternatives found
  if (alternatives.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Better Alternatives</h3>
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-blue-800">One of the best in its category</p>
            <p className="text-sm text-blue-700">
              We couldn&apos;t find healthier alternatives in this category.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Better Alternatives</h3>
      <p className="text-sm text-gray-500 mb-4">
        Healthier options in the same category
      </p>

      <div className="space-y-3">
        {alternatives.map((alt) => (
          <AlternativeCard
            key={alt.barcode}
            alternative={alt}
            currentScore={product.healthScore}
          />
        ))}
      </div>

      {/* Note for international products */}
      {alternatives.some((a) => !a.availableInCanada) && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Some alternatives may not be available locally
        </p>
      )}
    </div>
  );
}

interface AlternativeCardProps {
  alternative: Alternative;
  currentScore: number;
}

function AlternativeCard({ alternative, currentScore }: AlternativeCardProps) {
  const scoreColor = getScoreColor(alternative.healthScore);
  const scoreDiff = alternative.healthScore - currentScore;

  return (
    <Link
      href={`/product/${alternative.barcode}`}
      className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
    >
      {/* Product image */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
        {alternative.imageUrl ? (
          <Image
            src={alternative.imageUrl}
            alt={alternative.name}
            fill
            sizes="64px"
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-green-700">
              {alternative.name}
            </h4>
            {alternative.brand && (
              <p className="text-xs text-gray-500 truncate">{alternative.brand}</p>
            )}
          </div>

          {/* Score badge */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: scoreColor }}
            >
              {alternative.healthScore}
            </div>
            <span className="text-xs font-medium text-green-600">+{scoreDiff}</span>
          </div>
        </div>

        {/* Improvements */}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {alternative.improvements.slice(0, 2).map((improvement, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {improvement}
            </span>
          ))}
        </div>

        {/* Canada badge */}
        {alternative.availableInCanada && (
          <div className="flex items-center gap-1 mt-1.5">
            <svg className="w-3 h-3 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
            </svg>
            <span className="text-xs text-gray-500">Available in Canada</span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 self-center">
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
