import authReducer, { initialState } from './authReducer';

describe('Auth Reducer', () => {
  it('should return default state', () => {
    const newState = authReducer(undefined, {});

    expect(newState).toEqual(initialState);
  });
});
