const isEmpty = require('../../src/validation/isEmpty');

describe('Validation Unit Tests', () => {
  it('isEmpty() - should check if object is empty', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(new Array(10))).toBe(true);

    expect(isEmpty(0)).toBe(false);
    expect(isEmpty('not empty')).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(new Array(10).fill(10))).toBe(false);
  });
});
