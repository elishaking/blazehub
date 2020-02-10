import moxios from 'moxios';
import { testStore } from '../utils/testUtils';
import { signupUser } from '../../redux_actions/authActions';

describe('signupUser action', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall()
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
