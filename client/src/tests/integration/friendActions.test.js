import moxios from 'moxios';
import { firebaseMock } from '../utils/mocks';
import { getFriends } from '../../redux_actions/friendActions';
import { testStore } from '../utils/testUtils';
import app from 'firebase/app';

describe('friend action creators', () => {
  beforeEach(() => {
    moxios.install();

    //@ts-ignore
    app.database = firebaseMock();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('getFriends action creator', () => {
    it('should update store with friends', async () => {
      const store = testStore();
      const friends = {
        "friend-1": {
          name: "John"
        },
        "friend-2": {
          name: "James"
        },
      };

      moxios.wait(() => {
        const req = moxios.requests.mostRecent();
        req.respondWith({
          status: 200,
          response: {
            data: friends
          }
        });
      });

      await store.dispatch(getFriends());
      const newState = store.getState();
      expect(newState.friends).toEqual(friends);
    });
  });

});
