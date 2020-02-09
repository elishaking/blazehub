import profileReducer, { initialState } from './profileReducer';

describe('Profile Reducer', () => {
  it('should return default state', () => {
    // @ts-ignore
    const newState = profileReducer(undefined, {});

    expect(newState).toEqual(initialState);
  });
});
