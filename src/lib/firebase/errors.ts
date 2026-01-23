import { FirebaseError } from 'firebase/app';

export type FirestoreErrorCode =
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'unavailable'
  | 'cancelled'
  | 'deadline-exceeded'
  | 'resource-exhausted'
  | 'unauthenticated'
  | 'unknown';

const ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'You do not have permission to perform this action',
  'not-found': 'The requested data was not found',
  'already-exists': 'This item already exists',
  'unavailable': 'Service temporarily unavailable. Please try again.',
  'cancelled': 'The operation was cancelled',
  'deadline-exceeded': 'The operation took too long. Please try again.',
  'resource-exhausted': 'Too many requests. Please wait a moment.',
  'unauthenticated': 'Please sign in to continue',
};

export function getFirestoreErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] || 'An unexpected error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    return error.code === 'unavailable' || error.code === 'deadline-exceeded';
  }
  return false;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof FirebaseError) {
    return error.code === 'unauthenticated' || error.code === 'permission-denied';
  }
  return false;
}

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000, backoffMultiplier = 2 } = options;

  let lastError: unknown;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Only retry on network errors
      if (!isNetworkError(error) || attempt === maxAttempts) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError;
}

export async function safeFirestoreOperation<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await withRetry(operation);
  } catch (error) {
    const message = getFirestoreErrorMessage(error);
    console.error(`Firestore error${context ? ` in ${context}` : ''}:`, error);
    throw new Error(message);
  }
}
