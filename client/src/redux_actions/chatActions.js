//@ts-check
import axios from 'axios';
import app from 'firebase/app';
import 'firebase/database';
import { ADD_CHAT } from './types';

const now = Date.now();

// ===ACTIONS===

const addChat = (chat, chatKey) => ({
  type: ADD_CHAT,
  payload: { chatKey, chat }
});

// ===ACTION CREATORS===

// @action-type ADD_CHAT
// @description listen for new chats
export const listenForNewChats = (chatKeys) => (dispatch) => {
  chatKeys.forEach((chatKey) => {
    app.database().ref('chats').child(chatKey)
      .orderByChild("date").startAt(now)
      .on("child_added", (chatSnapshot) => {
        console.log("chat_added");
        dispatch(addChat({
          key: chatSnapshot.key,
          ...chatSnapshot.val()
        }, chatKey))
      });
  });
};