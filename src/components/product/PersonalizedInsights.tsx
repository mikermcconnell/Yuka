'use client';

import { PersonalizedAnalysis } from '@/types';
import PersonalizedWarnings from './PersonalizedWarnings';
import PersonalizedBadges from './PersonalizedBadges';
import ProfileSummaryCard from './ProfileSummaryCard';
import ContextualExplanations from './ContextualExplanations';

interface PersonalizedInsightsProps {
  analysis: PersonalizedAnalysis;
  userName?: string;
  variant?: 'full' | 'compact' | 'summary-only';
}

/**
 * Combined component that displays all personalized insights for a product.
 * Use variant="full" for product detail pages, "compact" for cards, "summary-only" for lists.
 */
export default function PersonalizedInsights({
  analysis,
  userName = 'Your',
  variant = 'full',
}: PersonalizedInsightsProps) {
  const { warnings, badges, contextualExplanations, profileSummary } = analysis;

  const hasWarnings = warnings.length > 0;
  const hasBadges = badges.length > 0;
  const hasExplanations = contextualExplanations.length > 0;

  // Summary only - just show the profile summary card
  if (variant === 'summary-only') {
    return <ProfileSummaryCard summary={profileSummary} userName={userName} />;
  }

  // Compact - show warnings and badges in compact form
  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {/* Compact header */}
        <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Personalized for {userName} Genetics
        </div>

        {/* Compact warnings */}
        {hasWarnings && <PersonalizedWarnings warnings={warnings} compact />}

        {/* Compact badges */}
        {hasBadges && <PersonalizedBadges badges={badges} compact />}
      </div>
    );
  }

  // Full variant - show everything
  return (
    <div className="space-y-6">
      {/* Profile Summary Card - always shown first */}
      <ProfileSummaryCard summary={profileSummary} userName={userName} />

      {/* Warnings Section */}
      {hasWarnings && <PersonalizedWarnings warnings={warnings} />}

      {/* Badges Section */}
      {hasBadges && <PersonalizedBadges badges={badges} />}

      {/* Contextual Explanations */}
      {hasExplanations && <ContextualExplanations explanations={contextualExplanations} />}

      {/* Additive overrides note */}
      {analysis.additiveOverrides.length > 0 && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-purple-800 text-sm">Additive Risk Adjusted</h4>
              <p className="text-sm text-purple-700 mt-0.5">
                {analysis.additiveOverrides.length} additive{analysis.additiveOverrides.length > 1 ? 's have' : ' has'} been
                re-evaluated based on your genetic profile. Check the additives section for details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Banner shown at the top of product pages when personalization is active
 */
export function PersonalizedBanner({ userName = 'your' }: { userName?: string }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
      </svg>
      <span className="text-sm font-medium">
        Score personalized for {userName} genetic profile
      </span>
    </div>
  );
}

/**
 * Small indicator badge for product cards
 */
export function PersonalizedIndicator() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      Personalized
    </span>
  );
}
