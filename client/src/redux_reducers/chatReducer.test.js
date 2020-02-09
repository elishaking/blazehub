import chatReducer from './chatReducer';

describe('Chat Reducer', () => {
  it('should return default state', () => {
    const newState = chatReducer(undefined, {});

    expect(newState).toEqual({});
  });
});
