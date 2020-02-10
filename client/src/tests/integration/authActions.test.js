import moxios from 'moxios';
import { testStore } from '../utils/testUtils';
import { signupUser } from '../../redux_actions/authActions';
import { initialState as initialAuthState } from '../../redux_reducers/authReducer';

describe('auth action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall()
  });

  describe('signupUser action creator', () => {
    it('should not update store for successful sign-up', () => {
      const userData = {
        name: "King"
      };
      const store = testStore();

      moxios.wait(() => {
        const req = moxios.requests.mostRecent();
        req.respondWith({
          status: 201,
          response: userData
        });
      });

      return store.dispatch(signupUser())
        .then(() => {
          const newState = store.getState();
          expect(newState.auth).toEqual(initialAuthState);
        });
    });

    it('should update store correctly (with errors)', () => {
      const expectedErrorState = {
        name: "name is required"
      };
      const store = testStore();

      moxios.wait(() => {
        const req = moxios.requests.mostRecent();
        req.respondWith({
          status: 400,
          response: expectedErrorState
        });
      });

      return store.dispatch(signupUser())
        .then(() => {
          const newState = store.getState();
          expect(newState.auth.errors).toEqual(expectedErrorState);
        });
    });
  });
});
