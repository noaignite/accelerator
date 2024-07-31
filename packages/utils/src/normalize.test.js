import { describe, expect, it } from 'vitest';
import normalize from './normalize';

describe('normalize', () => {
  it('is a function and returns a number', () => {
    expect(typeof normalize).toEqual('function');
    expect(typeof normalize(1, 2, 3)).toEqual('number');
  });

  it('returns the correct result', () => {
    expect(normalize(0, 0, 10)).toEqual(0);
    expect(normalize(10, 0, 10)).toEqual(1);
    expect(normalize(5, 0, 10)).toEqual(0.5);
    expect(normalize(-5, 0, 10)).toEqual(-0.5);
    expect(normalize(50, 0, 10)).toEqual(5);
  });
});
