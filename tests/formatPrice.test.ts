import { describe, expect, it } from 'vitest';
import { formatPrice } from '@/lib/formatPrice';

describe('formatPrice', () => {
  it('formats EUR amounts in French locale', () => {
    expect(formatPrice(59.9)).toContain('59,90');
  });

  it('respects the provided currency', () => {
    expect(formatPrice(10, 'USD', 'en-US')).toBe('$10.00');
  });
});
