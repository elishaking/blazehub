import { SET_PROFILE_PIC } from '../redux_actions/types';
import profileReducer, { initialState } from './profileReducer';

describe('Profile Reducer', () => {
  it('should return default state', () => {
    // @ts-ignore
    const newState = profileReducer(undefined, {});

    expect(newState).toEqual(initialState);
  });

  it('should return new profile state', () => {
    const profilePicData = {
      key: "avatar",
      dataUrl: "avatarDataUrl"
    };
    const action = {
      type: SET_PROFILE_PIC,
      payload: profilePicData
    };

    const newState = profileReducer(undefined, action);
    expect(newState).toEqual({
      ...initialState,
      [profilePicData.key]: profilePicData.dataUrl,
    });
  });
});
