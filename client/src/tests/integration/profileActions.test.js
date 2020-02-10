import { testStore } from '../utils/testUtils';
import { getProfilePic, updateProfilePic } from '../../redux_actions/profileActions';
import { initialState as initialProfileState } from '../../redux_reducers/profileReducer';
import app from 'firebase/app';
import { firebaseMock } from '../utils/mocks';

describe('profile action creators', () => {
  const profilePicData = {
    key: "avatar",
    dataUrl: "avatarDataUrl"
  };

  beforeEach(() => {
    // @ts-ignore
    app.database = firebaseMock(profilePicData.dataUrl);
  });

  describe('getProfilePic action creator', () => {
    it(`should update store with new ${profilePicData.key} profile pic`, async () => {
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

  describe('updateProfilePic action creator', () => {
    it(`should update existing ${profilePicData.key} profile pic in store`, async () => {
      const store = testStore();
      const currentProfileState = store.getState().profile;

      await store.dispatch(updateProfilePic('', profilePicData.key, profilePicData.dataUrl));

      const newState = store.getState();
      expect(newState.profile).toEqual({
        ...currentProfileState,
        [profilePicData.key]: profilePicData.dataUrl
      });
    });
  });

});
