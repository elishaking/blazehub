const app = require('firebase/app');
require('firebase/database');

const ResponseUtil = require('../utils/response');

const dbRef = app.database().ref();

/**
 * Fetch friends from firebase
 * @param {string} userKey 
 */
const fetchFriends = (userKey) => new Promise((resolve) => {
  dbRef.child('friends').child(userKey).once('value')
    .then((friendsSnapShot) => {
      const friendsExist = friendsSnapShot.exists();
      const data = friendsExist ? friendsSnapShot.val() : undefined;
      resolve(ResponseUtil.createResponse(
        true,
        200,
        friendsExist ? "Found friends" : "No friends found",
        data
      ));
    })
    .catch((err) => {
      console.log(err);

      resolve(ResponseUtil.createResponse(
        false,
        500,
        "Could not fetch friends"
      ))
    });
});

module.exports = {
  fetchFriends
};
