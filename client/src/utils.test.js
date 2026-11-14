import { describe, expect, it } from 'vitest';
import { formatDate, SLOT_LABELS, today } from './utils';

describe('client utilities', () => {
  it('contains all four reading slots', () => {
    expect(Object.keys(SLOT_LABELS)).toHaveLength(4);
  });
  it('formats calendar dates without shifting the day', () => {
    expect(formatDate('2026-11-14')).toContain('Nov 14, 2026');
  });
  it('returns an ISO calendar date', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
