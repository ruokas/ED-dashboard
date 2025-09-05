import { isOverdue } from '../src/utils/bedState.js';

describe('isOverdue', () => {
  test('returns false when lastCheckedAt is null', () => {
    expect(isOverdue(null)).toBe(false);
  });

  test('treats zero timestamp as overdue', () => {
    expect(isOverdue(0)).toBe(true);
  });

  test('returns false when within limit', () => {
    const lastChecked = Date.now() - 10 * 60 * 1000; // 10 minutes ago
    expect(isOverdue(lastChecked)).toBe(false);
  });

  test('returns true when beyond limit', () => {
    const lastChecked = Date.now() - 31 * 60 * 1000; // 31 minutes ago
    expect(isOverdue(lastChecked)).toBe(true);
  });
});
