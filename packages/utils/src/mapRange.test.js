import { describe, expect, it } from 'vitest';
import mapRange from './mapRange';

describe('mapRange', () => {
  it('is a function and returns a number', () => {
    expect(typeof mapRange).toEqual('function');
    expect(typeof mapRange(1, 2, 3, 4, 5)).toEqual('number');
  });

  it('returns the correct result', () => {
    expect(mapRange(0, 0, 10, 0, 100)).toEqual(0);
    expect(mapRange(10, 0, 10, 0, 100)).toEqual(100);
    expect(mapRange(5, 0, 10, 0, 100)).toEqual(50);
    expect(mapRange(50, 0, 100, 0, 10)).toEqual(5);
    expect(mapRange(-5, 0, 10, 0, 100)).toEqual(-50);
    expect(mapRange(15, 0, 10, 0, 100)).toEqual(150);
    expect(mapRange(-5, 0, 10, 0, 100, true)).toEqual(0);
    expect(mapRange(15, 0, 10, 0, 100, true)).toEqual(100);
  });
});
