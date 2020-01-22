const ErrorMessage = require('../../src/utils/errorMessage');

describe('RequireError() Unit Tests', () => {
  it('RequireError() should return correct error message', () => {
    expect(ErrorMessage.RequireError('<fieldName>'))
      .toEqual('Your <fieldName> is required')
  });
});

describe('InvalidError() Unit Tests', () => {
  it('InvalidError() should return correct error message', () => {
    expect(ErrorMessage.InvalidError('<fieldName>'))
      .toEqual('Please enter a valid <fieldName>')
  });
});

describe('LengthError() Unit Tests', () => {
  it('LengthError() should return correct error message', () => {
    expect(ErrorMessage.LengthError('<fieldName>', 3, 13))
      .toEqual('Your <fieldName> must be between 3 and 13 characters')
  });
});
