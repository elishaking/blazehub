const isEmpty = require('../../src/validation/isEmpty');
const validateSignupData = require('../../src/validation/signup');
const validateSigninData = require('../../src/validation/signin');

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

  it('validateSignupData() - should validate sign-up data', () => {
    const data = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    const validationResult = validateSignupData(data);

    expect(validationResult.isValid).toBe(false);
  });
});
