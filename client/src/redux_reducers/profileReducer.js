import { SET_PROFILE_PIC } from "../redux_actions/types";

export const initialState = {
  avatar: '',
  coverPhoto: ''
};

/**
 * @param {{ type: string; payload: { key: string; dataUrl: string; }; }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE_PIC:
      return {
        ...state,
        [action.payload.key]: action.payload.dataUrl
      };

    default:
      return state;
  }
}