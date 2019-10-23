import { SET_FRIENDS, ADD_FRIEND } from "../redux_actions/types";

const initialState = {};

// ===REDUCERS===
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FRIENDS:
      return {
        ...state,
        ...action.payload
      };

    case ADD_FRIEND:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state;
  }
}