import { SET_AVATAR } from "../redux_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case SET_AVATAR:
      return {
        ...state,
        avatar: action.payload
      };

    default:
      return state;
  }
}