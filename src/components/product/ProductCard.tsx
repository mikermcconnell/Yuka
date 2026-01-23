'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, HistoryEntry, FavoriteEntry } from '@/types';
import { Card } from '@/components/ui';
import ScoreGauge, { getScoreColor } from './ScoreGauge';

interface ProductCardProps {
  product: Product | HistoryEntry | FavoriteEntry;
  onClick?: () => void;
  showActions?: boolean;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  product,
  onClick,
  showActions = false,
  onFavoriteToggle,
  isFavorite = false,
}: ProductCardProps) {
  const name = 'name' in product ? product.name : product.productName;
  const imageUrl = product.imageUrl;
  const score = product.healthScore;

  const cardContent = (
    <Card
      clickable={!!onClick || true}
      className="flex items-center gap-4 hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="64px"
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        {product.brand && (
          <p className="text-sm text-gray-500 truncate">{product.brand}</p>
        )}
      </div>

      {/* Score */}
      <div className="flex-shrink-0 flex items-center gap-3">
        <ScoreGauge score={score} size="sm" showLabel={false} />

        {/* Favorite button */}
        {showActions && onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
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
          </button>
        )}
      </div>
    </Card>
  );

  // Wrap in Link if no custom onClick
  if (!onClick) {
    return (
      <Link href={`/product/${product.barcode}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

// Compact version for lists
interface ProductListItemProps {
  product: HistoryEntry | FavoriteEntry;
  onDelete?: () => void;
}

export function ProductListItem({ product, onDelete }: ProductListItemProps) {
  const name = product.productName;
  const score = product.healthScore;
  const scoreColor = getScoreColor(score);

  return (
    <Link
      href={`/product/${product.barcode}`}
      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition-colors"
    >
      {/* Image */}
      <div className="flex-shrink-0 w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            sizes="48px"
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate text-sm">{name}</h4>
        {product.brand && (
          <p className="text-xs text-gray-500 truncate">{product.brand}</p>
        )}
      </div>

      {/* Score */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
        style={{ backgroundColor: scoreColor }}
      >
        {score}
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </Link>
  );
}
