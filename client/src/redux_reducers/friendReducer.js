import { SET_FRIENDS } from "../redux_actions/types";

const initialState = {};

// ===REDUCERS===
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FRIENDS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}