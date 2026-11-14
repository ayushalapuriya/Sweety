import { describe, expect, it } from 'vitest';
import { validateReading } from './validation/readings.js';

describe('reading validation', () => {
  const base = { date: '2020-01-01', timeSlot: 'morning' };
  it('requires a value', () => expect(validateReading(base)[0]).toBe('Please enter a glucose value.'));
  it('rejects values outside the supported range', () => expect(validateReading({ ...base, glucoseValue: 601 })[0]).toBe('Value must be between 40 and 600 mg/dl.'));
  it('rejects future dates', () => expect(validateReading({ ...base, date: '2999-01-01', glucoseValue: 100 })[0]).toBe('Date cannot be in the future.'));
});
