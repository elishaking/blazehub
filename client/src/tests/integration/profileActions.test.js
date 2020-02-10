import { testStore } from '../utils/testUtils';
import { getProfilePic, updateProfilePic } from '../../redux_actions/profileActions';
import { initialState as initialProfileState } from '../../redux_reducers/profileReducer';
import app from 'firebase/app';

describe('getProfilePic action', () => {
  const profilePicData = {
    key: "avatar",
    dataUrl: "avatarDataUrl"
  };

  beforeEach(() => {
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

        const set = (value) => {
          return new Promise((resolve) => {
            resolve();
          });
        };

        const child = (path) => ({
          child,
          once,
          set
        });

        return { child, once, set };
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

  it(`should update existing avatar profile pic in store`, async () => {
    const store = testStore();
    const currentProfileState = store.getState().profile;

    await store.dispatch(updateProfilePic('', profilePicData.key, profilePicData.dataUrl));

    const newState = store.getState();
    expect(newState.profile).toEqual({
      ...currentProfileState,
      [profilePicData.key]: profilePicData.dataUrl
    })
  });
});
