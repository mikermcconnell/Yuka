'use client';

import { PersonalizedProfileSummary, ProfileSummaryItem } from '@/types';

interface ProfileSummaryCardProps {
  summary: PersonalizedProfileSummary;
  userName?: string;
}

const statusConfig: Record<ProfileSummaryItem['status'], {
  icon: React.ReactNode;
  color: string;
  bg: string;
}> = {
  good: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  caution: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  bad: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  unknown: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-gray-500',
    bg: 'bg-gray-50',
  },
};

const overallFitConfig: Record<PersonalizedProfileSummary['overallFit'], {
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  excellent: {
    label: 'Excellent Fit',
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-300',
  },
  good: {
    label: 'Good Fit',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  caution: {
    label: 'Some Concerns',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
  },
  poor: {
    label: 'Not Recommended',
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-300',
  },
};

export default function ProfileSummaryCard({ summary, userName = 'Your' }: ProfileSummaryCardProps) {
  const fitConfig = overallFitConfig[summary.overallFit];

  // Sort items: bad first, then caution, then good, then unknown
  const sortedItems = [...summary.items].sort((a, b) => {
    const order: Record<ProfileSummaryItem['status'], number> = { bad: 0, caution: 1, good: 2, unknown: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className={`rounded-xl border-2 ${fitConfig.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${fitConfig.bg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
          <span className="font-semibold text-gray-800">For {userName} Genetics</span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${fitConfig.bg} ${fitConfig.color}`}>
          {fitConfig.label}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white divide-y divide-gray-100">
        {sortedItems.map((item, index) => {
          const config = statusConfig[item.status];
          return (
            <div key={index} className="px-4 py-3 flex items-center gap-3">
              <span className={config.color}>{config.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-800">{item.label}</span>
                {item.detail && (
                  <span className="text-xs text-gray-500 ml-2">({item.detail})</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Based on your genetic profile analysis
        </p>
      </div>
    </div>
  );
}

// Compact version for product cards
export function ProfileSummaryBadge({ summary }: { summary: PersonalizedProfileSummary }) {
  const fitConfig = overallFitConfig[summary.overallFit];
  const goodCount = summary.items.filter(i => i.status === 'good').length;
  const badCount = summary.items.filter(i => i.status === 'bad').length;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${fitConfig.bg} ${fitConfig.color} border ${fitConfig.border}`}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <span>{fitConfig.label}</span>
      {(goodCount > 0 || badCount > 0) && (
        <span className="opacity-75">
          ({goodCount > 0 && `${goodCount} good`}{goodCount > 0 && badCount > 0 && ', '}{badCount > 0 && `${badCount} concern${badCount > 1 ? 's' : ''}`})
        </span>
      )}
    </div>
  );
}
