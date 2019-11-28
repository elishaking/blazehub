import { SET_PROFILE_PIC } from "../redux_actions/types";

/**
 * @param {{ type: string; payload: { key: string; dataUrl: string; }; }} action
 */
export default function (state = { avatar: '', coverPhoto: '' }, action) {
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