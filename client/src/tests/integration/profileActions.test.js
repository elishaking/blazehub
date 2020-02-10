import { testStore } from '../utils/testUtils';
import { getProfilePic } from '../../redux_actions/profileActions';
import { initialState as initialProfileState } from '../../redux_reducers/profileReducer';
import app from 'firebase/app';

describe('getProfilePic action', () => {
  const profilePicData = {
    key: "avatar",
    dataUrl: "avatarDataUrl"
  };

  beforeAll(() => {
    // @ts-ignore
    app.database = jest.fn().mockReturnValueOnce({
      ref: (path) => {
        const once = (event) => {
          if (event === "value") {
            return new Promise((resolve) => {
              resolve({
                val: () => profilePicData.dataUrl
              });
            });
          }
        };

        const child = (path) => ({
          child,
          once
        });

        return { child, once };
      }
    });
  });

  it('should update store with new avatar profile pic', async () => {
    const store = testStore();

    await store.dispatch(getProfilePic('', profilePicData.key));

    const newState = store.getState();
    const expectedProfileState = {
      ...initialProfileState,
      [profilePicData.key]: profilePicData.dataUrl
    };
    expect(newState.profile).toEqual(expectedProfileState);
  });
});
