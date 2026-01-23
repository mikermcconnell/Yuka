'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Header, ProductDetailsSkeleton } from '@/components/layout';
import {
  ScoreGauge,
  ScoreBar,
  NutriScore,
  NovaGroup,
  NutritionTable,
  IngredientList,
  AdditivesList,
  BetterAlternatives,
  PersonalizedBanner,
  PersonalizedInsights,
} from '@/components/product';
import { Button } from '@/components/ui';
import { useProduct } from '@/hooks/useProduct';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';

export default function ProductPage() {
  const params = useParams();
  const barcode = params.barcode as string;
  const { user } = useAuth();
  const { product, loading, error, notFound, fetchProductByBarcode } = useProduct({
    userEmail: user?.email,
  });
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some((f) => f.barcode === barcode);

  useEffect(() => {
    if (barcode) {
      fetchProductByBarcode(barcode);
    }
  }, [barcode, fetchProductByBarcode]);

  const handleToggleFavorite = async () => {
    if (!user) {
      // Could show login prompt
      return;
    }
    if (product) {
      await toggleFavorite(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Loading..." showBack />
        <main className="px-4 py-6">
          <ProductDetailsSkeleton />
        </main>
      </div>
    );
  }

  if (error || notFound) {
    return (
      <div className="min-h-screen">
        <Header title="Product Not Found" showBack />
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || `We couldn't find a product with barcode ${barcode}`}
            </p>
            <p className="text-sm text-gray-500">
              This product might not be in the Open Food Facts database yet.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen">
      <Header title="Product Details" showBack />

      <main className="px-4 py-6 space-y-6 animate-fadeIn">
        {/* Product Image */}
        {product.imageUrl && (
          <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-4"
              priority
            />
          </div>
        )}

        {/* Personalized Banner */}
        {product.isPersonalizedScore && (
          <PersonalizedBanner userName={user?.displayName?.split(' ')[0] || 'your'} />
        )}

        {/* Product Info & Score */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            {product.brand && (
              <p className="text-gray-600 mt-1">{product.brand}</p>
            )}
            {product.quantity && (
              <p className="text-sm text-gray-500 mt-1">{product.quantity}</p>
            )}
          </div>
          <ScoreGauge score={product.healthScore} size="lg" />
        </div>

        {/* Score breakdown bar */}
        <ScoreBar score={product.healthScore} />

        {/* Scores row */}
        <div className="flex gap-6 flex-wrap">
          <NutriScore grade={product.nutritionGrade} />
          <NovaGroup group={product.novaGroup} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleToggleFavorite}
            variant={isFavorite ? 'primary' : 'outline'}
            className="flex-1"
          >
            <svg
              className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`}
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
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" className="flex-1">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </Button>
        </div>

        {/* Score breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Score Breakdown</h3>
          <div className="space-y-2">
            {product.scoreBreakdown.details.map((detail, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm text-gray-700">{detail.description}</span>
                <span
                  className={`text-sm font-medium ${
                    detail.type === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {detail.points > 0 ? '+' : ''}
                  {detail.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Insights Section */}
        {product.personalizedAnalysis && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <PersonalizedInsights
              analysis={product.personalizedAnalysis}
              userName={user?.displayName?.split(' ')[0]}
              variant="full"
            />
          </div>
        )}

        {/* Additives Section */}
        {product.additives.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <AdditivesList additives={product.additives} />
          </div>
        )}

        {/* Better Alternatives Section */}
        <BetterAlternatives product={product} />

        {/* Nutrition Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <NutritionTable
            nutriments={product.nutriments}
            servingSize={product.servingSize}
          />
        </div>

        {/* Ingredients Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <IngredientList
            ingredients={product.ingredients}
            allergens={product.allergens}
          />
        </div>

        {/* Categories and labels */}
        {(product.categories.length > 0 || product.labels.length > 0) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {product.categories.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {product.labels.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {product.labels.map((label, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Barcode */}
        <p className="text-center text-sm text-gray-400">Barcode: {barcode}</p>
      </main>
    </div>
  );
}
