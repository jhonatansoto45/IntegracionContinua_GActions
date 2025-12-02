import { describe, it, expect } from 'vitest';
import { add } from '../utils/add.js';

describe('add util', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
