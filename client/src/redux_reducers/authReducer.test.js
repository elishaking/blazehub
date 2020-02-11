import { SET_CURRENT_USER, GET_ERRORS } from '../redux_actions/types';
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

  it('should return error state', () => {
    const errors = { password: "Password is incorrect" };
    const action = {
      type: GET_ERRORS,
      payload: errors
    };

    const newState = authReducer(undefined, action);
    expect(newState).toEqual({
      isAuthenticated: false,
      user: {},
      errors
    });
  });
});
