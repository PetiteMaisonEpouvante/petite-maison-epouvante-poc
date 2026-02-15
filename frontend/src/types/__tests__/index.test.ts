import { describe, it, expect } from 'vitest';
import { CATEGORY_LABELS, CONDITION_LABELS, TYPE_LABELS, REPORT_REASON_LABELS } from '../index';

describe('Type labels', () => {
  describe('CATEGORY_LABELS', () => {
    it('should have all 9 categories', () => {
      expect(Object.keys(CATEGORY_LABELS)).toHaveLength(9);
    });

    it('should contain FIGURINES', () => {
      expect(CATEGORY_LABELS.FIGURINES).toBe('Figurines');
    });

    it('should contain DVD_BLURAY', () => {
      expect(CATEGORY_LABELS.DVD_BLURAY).toBe('DVD / Blu-ray');
    });

    it('should contain BOOKS', () => {
      expect(CATEGORY_LABELS.BOOKS).toBe('Livres');
    });

    it('should contain OTHER', () => {
      expect(CATEGORY_LABELS.OTHER).toBe('Autre');
    });
  });

  describe('CONDITION_LABELS', () => {
    it('should have all 4 conditions', () => {
      expect(Object.keys(CONDITION_LABELS)).toHaveLength(4);
    });

    it('should contain MINT', () => {
      expect(CONDITION_LABELS.MINT).toBe('Neuf');
    });

    it('should contain POOR', () => {
      expect(CONDITION_LABELS.POOR).toBe('Mauvais état');
    });
  });

  describe('TYPE_LABELS', () => {
    it('should have 2 types', () => {
      expect(Object.keys(TYPE_LABELS)).toHaveLength(2);
    });

    it('should contain TRADE', () => {
      expect(TYPE_LABELS.TRADE).toBe('Échange');
    });

    it('should contain GIVE', () => {
      expect(TYPE_LABELS.GIVE).toBe('Don');
    });
  });

  describe('REPORT_REASON_LABELS', () => {
    it('should have 5 reasons', () => {
      expect(Object.keys(REPORT_REASON_LABELS)).toHaveLength(5);
    });

    it('should contain SPAM', () => {
      expect(REPORT_REASON_LABELS.SPAM).toBe('Spam');
    });
  });
});
