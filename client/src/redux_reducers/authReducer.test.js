import { SET_CURRENT_USER } from '../redux_actions/types';
import authReducer, { initialState } from './authReducer';

describe('Auth Reducer', () => {
  it('should return default state', () => {
    const newState = authReducer(undefined, {});

    expect(newState).toEqual(initialState);
  });

  it('should return new user state', () => {
    const user = { name: "King" };
    const action = {
      type: SET_CURRENT_USER,
      payload: user
    };

    const newState = authReducer(undefined, action);
    expect(newState).toEqual({
      isAuthenticated: true,
      user,
      errors: {}
    });
  });
});
