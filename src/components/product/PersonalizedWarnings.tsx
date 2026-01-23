'use client';

import { PersonalizedWarning, WarningSeverity } from '@/types';

interface PersonalizedWarningsProps {
  warnings: PersonalizedWarning[];
  compact?: boolean;
}

const severityConfig: Record<WarningSeverity, {
  bg: string;
  border: string;
  text: string;
  icon: string;
  iconBg: string;
}> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  caution: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    icon: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
  },
};

const SeverityIcon = ({ severity }: { severity: WarningSeverity }) => {
  if (severity === 'info') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
  }

  if (severity === 'caution') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    );
  }

  // warning and critical
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
};

export default function PersonalizedWarnings({ warnings, compact = false }: PersonalizedWarningsProps) {
  if (warnings.length === 0) {
    return null;
  }

  // Sort by severity: critical > warning > caution > info
  const sortedWarnings = [...warnings].sort((a, b) => {
    const order: Record<WarningSeverity, number> = { critical: 0, warning: 1, caution: 2, info: 3 };
    return order[a.severity] - order[b.severity];
  });

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {sortedWarnings.map((warning) => {
          const config = severityConfig[warning.severity];
          return (
            <div
              key={warning.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border} border`}
            >
              <span className={config.icon}>
                <SeverityIcon severity={warning.severity} />
              </span>
              {warning.title}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
        For Your Genetics
      </h3>

      <div className="space-y-2">
        {sortedWarnings.map((warning) => {
          const config = severityConfig[warning.severity];
          return (
            <div
              key={warning.id}
              className={`${config.bg} ${config.border} border rounded-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 p-1.5 rounded-full ${config.iconBg} ${config.icon}`}>
                  <SeverityIcon severity={warning.severity} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${config.text}`}>{warning.title}</h4>
                  <p className="text-sm text-gray-600 mt-0.5">{warning.message}</p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                      <path d="M10 5a1 1 0 011 1v4a1 1 0 01-2 0V6a1 1 0 011-1z" />
                    </svg>
                    {warning.geneticBasis}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
