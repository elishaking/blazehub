import { ADD_CHAT } from '../redux_actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case ADD_CHAT:
      let chats = state;
      const { chatKey, chat } = action.payload
      if (chats[chatKey]) {
        chats[chatKey].unshift(chat);
      } else {
        chats[chatKey] = [chat];
      }
      return chats;

    default:
      return state;
  }
}