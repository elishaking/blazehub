import axios from 'axios';
import app from 'firebase/app';
import 'firebase/database';
import { ADD_CHAT } from './types';

const chatsRef = app.database().ref('chats');

// ===ACTIONS===

const addChat = (chat, chatKey) => ({
  type: ADD_CHAT,
  payload: { chatKey, chat }
});

// ===ACTION CREATORS===

// @action-type ADD_CHAT
// @description listen for new chats
export const listenForNewChats = (userKey, chatKeys) => (dispatch) => {
  chatKeys.forEach((chatKey) => {
    chatsRef.child(userKey).child(chatKey)
      .orderByChild("date").startAt(Date.now())
      .on("child_added", (chatSnapshot) => dispatch(addChat({
        key: chatSnapshot.key,
        ...chatSnapshot.val()
      })));
  });
};