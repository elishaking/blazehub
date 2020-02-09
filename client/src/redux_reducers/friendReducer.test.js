import { SET_FRIENDS, ADD_FRIEND } from '../redux_actions/types';
import friendReducer from './friendReducer';

describe('Friend Reducer', () => {
  it('should return default state', () => {
    const newState = friendReducer(undefined, {});

    expect(newState).toEqual({});
  });

  it('should return new friends state', () => {
    const friends = [
      {
        name: "John"
      },
      {
        name: "James"
      },
    ];
    const action = {
      type: SET_FRIENDS,
      payload: friends
    };

    const newState = friendReducer(undefined, action);
    expect(newState).toEqual({
      "0": friends[0],
      "1": friends[1]
    });
  });

  it('should return new friends state with added friend', () => {
    const friends = [
      {
        name: "John"
      },
      {
        name: "James"
      },
    ];
    const newFriend = {
      newFriendKey: {
        name: "Peter"
      }
    };
    const action = {
      type: ADD_FRIEND,
      payload: newFriend
    };

    const newState = friendReducer(friends, action);
    expect(newState).toEqual({
      "0": friends[0],
      "1": friends[1],
      "newFriendKey": newFriend.newFriendKey
    });
  });
});
