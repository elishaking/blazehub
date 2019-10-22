import { SET_FRIENDS } from "../redux_actions/types";

const initialState = {
  friends: {}
};

// ===REDUCERS===
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FRIENDS:
      return {
        ...state,
        friends: action.payload
      };

    default:
      return state;
  }
}