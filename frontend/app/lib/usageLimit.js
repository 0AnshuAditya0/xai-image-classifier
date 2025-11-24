// Usage limiting utilities
export const USAGE_LIMIT = 3;
export const USAGE_KEY = 'xai_usage_count';
export const MAX_FREE_ATTEMPTS = 3;

export function getUsageCount() {
  if (typeof window === 'undefined') return 0;
  const count = localStorage.getItem(USAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

export function incrementUsageCount() {
  if (typeof window === 'undefined') return;
  const currentCount = getUsageCount();
  localStorage.setItem(USAGE_KEY, (currentCount + 1).toString());
}

export function hasReachedLimit() {
  return getUsageCount() >= MAX_FREE_ATTEMPTS;
}

export function getRemainingAttempts() {
  return Math.max(0, MAX_FREE_ATTEMPTS - getUsageCount());
}

export function resetUsageCount() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USAGE_KEY);
}
