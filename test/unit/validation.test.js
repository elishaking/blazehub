const isEmpty = require('../../src/validation/isEmpty');
const validateSignupData = require('../../src/validation/signup');
const ErrorMessage = require('../../src/utils/errorMessage');

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

  it('validateSignupData() - should validate empty data fields as inValid', () => {
    const data = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    const validationResult = validateSignupData(data);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.email).toEqual(ErrorMessage.RequireError('email'));
    expect(validationResult.errors.firstName).toEqual(ErrorMessage.RequireError('first name'));
    expect(validationResult.errors.lastName).toEqual(ErrorMessage.RequireError('last name'));
    expect(validationResult.errors.password).toEqual(ErrorMessage.RequireError('password'));
  });

  it('validateSignupData() - should validate empty data as inValid', () => {
    const data = {};

    const validationResult = validateSignupData(data);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.email).toEqual(ErrorMessage.RequireError('email'));
    expect(validationResult.errors.firstName).toEqual(ErrorMessage.RequireError('first name'));
    expect(validationResult.errors.lastName).toEqual(ErrorMessage.RequireError('last name'));
    expect(validationResult.errors.password).toEqual(ErrorMessage.RequireError('password'));
  });
});
