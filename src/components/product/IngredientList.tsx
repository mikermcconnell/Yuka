'use client';

interface IngredientListProps {
  ingredients?: string;
  allergens: string[];
}

export default function IngredientList({
  ingredients,
  allergens,
}: IngredientListProps) {
  return (
    <div className="w-full space-y-6">
      {/* Allergens Warning */}
      {allergens.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="font-medium text-orange-800">Allergen Warning</h4>
              <p className="text-sm text-orange-700 mt-1">
                Contains: {allergens.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients Text */}
      {ingredients && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {ingredients}
          </p>
        </div>
      )}

      {/* No ingredients available */}
      {!ingredients && allergens.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No ingredient information available</p>
        </div>
      )}
    </div>
  );
}

