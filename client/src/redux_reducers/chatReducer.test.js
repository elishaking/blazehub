import { ADD_CHAT } from '../redux_actions/types';
import chatReducer from './chatReducer';

describe('Chat Reducer', () => {
  it('should return default state', () => {
    const newState = chatReducer(undefined, {});

    expect(newState).toEqual({});
  });

  it('should return new chat state', () => {
    const chat = {
      chatKey: "key",
      message: {
        key: "messageKey",
        value: "Hello World"
      }
    };
    const action = {
      type: ADD_CHAT,
      payload: chat
    };

    const newState = chatReducer(undefined, action);
    expect(newState).toEqual({
      [chat.chatKey]: {
        [chat.message.key]: chat.message
      }
    });
  });
});
