import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate } from '../lib/utils';

describe('Utility Functions', () => {
  describe('cn (Tailwind class merging)', () => {
    it('should merge classes and resolve tailwind conflicts', () => {
      const result = cn('px-2 py-1', 'bg-blue-500', 'px-4');
      expect(result).toBe('py-1 bg-blue-500 px-4');
    });

    it('should handle conditional and falsy inputs cleanly', () => {
      const isHidden = false;
      const isVisible = true;
      const result = cn(
        'text-sm font-medium',
        isHidden && 'hidden',
        isVisible && 'block',
        undefined,
        null
      );
      expect(result).toBe('text-sm font-medium block');
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers into USD currency string', () => {
      const formatted = formatCurrency(145000);
      expect(formatted).toContain('145,000');
      expect(formatted).toContain('$');
    });

    it('should format zero correctly', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('0');
      expect(formatted).toContain('$');
    });

    it('should support alternative currencies', () => {
      const formatted = formatCurrency(95000, 'EUR');
      expect(formatted).toContain('95,000');
    });
  });

  describe('formatDate', () => {
    it('should return N/A for undefined or empty date', () => {
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
    });

    it('should format ISO date string to localized short date', () => {
      const formatted = formatDate('2026-10-15T12:00:00Z');
      expect(formatted).toContain('2026');
      expect(formatted).toMatch(/Oct/);
    });
  });
});
