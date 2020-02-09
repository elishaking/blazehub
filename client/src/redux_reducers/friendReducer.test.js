import friendReducer from './friendReducer';

describe('Friend Reducer', () => {
  it('should return default state', () => {
    const newState = friendReducer(undefined, {});

    expect(newState).toEqual({});
  });
});
