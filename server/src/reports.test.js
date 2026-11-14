import { describe, expect, it } from 'vitest';

function summarize(values) {
  return {
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
    total: values.length
  };
}

describe('report calculations', () => {
  it('calculates accurate summary values', () => {
    expect(summarize([101, 132, 148])).toEqual({ highest: 148, lowest: 101, average: 127, total: 3 });
  });
});
