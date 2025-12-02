import { describe, it, expect } from 'vitest';
import { add } from '../src/utils/add.js';

describe('add util', () => {
  it('adds two numbers', () => {
    expect(add(5, 7)).toBe(12);
  });
});
