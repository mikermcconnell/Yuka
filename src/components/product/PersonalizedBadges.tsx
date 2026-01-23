'use client';

import { useState } from 'react';
import { PersonalizedBadge } from '@/types';
import { Modal } from '@/components/ui';

interface PersonalizedBadgesProps {
  badges: PersonalizedBadge[];
  compact?: boolean;
}

const badgeIcons: Record<string, React.ReactNode> = {
  'heart-healthy': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  ),
  'omega3-rich': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ),
  'folate-fiber': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586l-1.42-1.42A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 9a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
  ),
  'endurance-fuel': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  ),
  'low-sat-fat': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
};

const defaultBadgeIcon = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function PersonalizedBadges({ badges, compact = false }: PersonalizedBadgesProps) {
  const [selectedBadge, setSelectedBadge] = useState<PersonalizedBadge | null>(null);

  if (badges.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
          >
            <span className="text-green-600">
              {badgeIcons[badge.id] || defaultBadgeIcon}
            </span>
            {badge.title}
          </button>
        ))}

        <Modal
          isOpen={selectedBadge !== null}
          onClose={() => setSelectedBadge(null)}
          title={selectedBadge?.title || ''}
        >
          {selectedBadge && <BadgeDetail badge={selectedBadge} />}
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Good For You
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {badges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
          >
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-full text-green-600">
              {badgeIcons[badge.id] || defaultBadgeIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-green-800">{badge.title}</h4>
              <p className="text-sm text-green-700 mt-0.5 line-clamp-2">{badge.description}</p>
            </div>
            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <Modal
        isOpen={selectedBadge !== null}
        onClose={() => setSelectedBadge(null)}
        title={selectedBadge?.title || ''}
      >
        {selectedBadge && <BadgeDetail badge={selectedBadge} />}
      </Modal>
    </div>
  );
}

function BadgeDetail({ badge }: { badge: PersonalizedBadge }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-100 rounded-full text-green-600">
          {badgeIcons[badge.id] || defaultBadgeIcon}
        </div>
        <div>
          <h3 className="font-semibold text-green-800 text-lg">{badge.title}</h3>
          <span className="text-xs text-green-600 font-medium uppercase tracking-wide">
            Personalized Badge
          </span>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="text-sm font-semibold text-green-800 mb-1">Why this is good for you</h4>
        <p className="text-gray-700">{badge.description}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Genetic Basis</h4>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
            <path d="M10 5a1 1 0 011 1v4a1 1 0 01-2 0V6a1 1 0 011-1z" />
          </svg>
          {badge.geneticBasis}
        </p>
      </div>
    </div>
  );
}
