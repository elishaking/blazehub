const ErrorMessage = require('../../src/utils/errorMessage');

describe('RequireError() Unit Tests', () => {
  it('RequireError() should return correct error message', () => {
    expect(ErrorMessage.RequireError('<fieldName>'))
      .toEqual('Your <fieldName> is required')
  });
});
