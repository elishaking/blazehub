//@ts-check
import { ADD_CHAT } from '../redux_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case ADD_CHAT:
      let chats = state;
      const { chatKey, message } = action.payload
      if (chats[chatKey]) {
        chats[chatKey][message.key] = message;
      } else {
        chats[chatKey] = { [message.key]: message };
      }
      return { ...chats };

    default:
      return state;
  }
}