import app from 'firebase/app';
import 'firebase/database';
import { ADD_CHAT } from './types';

const now = Date.now();

// ===ACTIONS===

const addMessage = (chatKey, message) => ({
  type: ADD_CHAT,
  payload: { chatKey, message }
});

// ===ACTION CREATORS===

// @action-type ADD_CHAT
// @description listen for new chats
export const listenForNewChats = (chatKeys) => (dispatch) => {
  chatKeys.forEach((chatKey) => {
    app.database().ref('chats').child(chatKey)
      .orderByChild("date").startAt(now)
      .on("child_added", (messageSnapshot) => {
        console.log("chat_added");
        dispatch(addMessage(chatKey, {
          key: messageSnapshot.key,
          ...messageSnapshot.val()
        }))
      });
  });
};