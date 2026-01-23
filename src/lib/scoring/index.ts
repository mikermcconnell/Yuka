export * from './healthScore';
export * from './additives';
export * from './additiveExplanations';
export * from './nutrientAnalysis';
export * from './personalizedConfigs';
export * from './personalizedAnalysis';

// New additive system modules (Feature 1-7)
export * from './additiveLoad';
export * from './additiveFunctions';
export * from './additiveResolver';
export * from './additiveInteractions';
export * from './regulatoryStatus';
export * from './personalizedAdditiveRules';

// Re-export from explanations folder
export {
  getAdditiveExplanation,
  hasExplanation,
  getExplanationsByRisk,
  getExplanationCounts,
  searchExplanations,
  ADDITIVE_EXPLANATIONS,
} from './explanations';
