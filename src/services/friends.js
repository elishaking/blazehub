const app = require("firebase/app");
require("firebase/database");

const { sendInviteMail } = require("../utils/email");

const ResponseUtil = require("../utils/response");

const dbRef = app.database().ref();

/**
 * Fetch friends from firebase
 * @param {string} userKey
 * @returns {Promise<{success: boolean, statusCode: number, message: string, data: any}>}
 */
const fetchFriends = (userKey) =>
  new Promise((resolve) => {
    dbRef
      .child("friends")
      .child(userKey)
      .once("value")
      .then((friendsSnapShot) => {
        const friendsExist = friendsSnapShot.exists();
        const data = friendsExist ? friendsSnapShot.val() : undefined;

        resolve(
          ResponseUtil.createResponse(
            true,
            200,
            friendsExist ? "Found friends" : "No friends found",
            data
          )
        );
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(false, 500, "Could not fetch friends")
        );
      });
  });

/**
 * Create a new friend in the database
 * @param {{userKey: string, friendKey: string, friend: any, user: any}} data
 * @returns {Promise<{success: boolean, statusCode: number, message: string, data: any}>}
 */
const createFriend = (data) =>
  new Promise((resolve) => {
    const { userKey, friendKey, friend, user } = data;

    // add new-friend to current-user's friends db
    dbRef
      .child("friends")
      .child(userKey)
      .child(friendKey)
      .set(friend, (err) => {
        if (err) console.error(err);

        // add current-user to new-friend's db
        dbRef
          .child("friends")
          .child(friendKey)
          .child(userKey)
          .set({
            name: `${user.firstName} ${user.lastName}`,
          })
          .then(() =>
            resolve(
              ResponseUtil.createResponse(
                true,
                200,
                "Friend created and added",
                { [friendKey]: friend }
              )
            )
          )
          .catch((err) => {
            console.log(err);

            resolve(
              ResponseUtil.createResponse(
                false,
                500,
                "Could not create new friend"
              )
            );
          });
      });
  });

/**
 *
 * @param {{invitees: {email: string}[], user: any}} data
 */
const sendInvites = (data) =>
  new Promise(async (resolve) => {
    const { invitees, user } = data;

    if (invitees[0].email == "")
      return resolve(
        ResponseUtil.createResponse(false, 400, "All invitees must have email")
      );

    let success = true;
    for (let i = 0; i < invitees.length; i++) {
      success = (await sendInviteMail(user, invitees[i].email)) && success;
    }

    resolve(
      ResponseUtil.createResponse(
        success,
        success ? 200 : 500,
        success ? "Emails sent" : "Could not send all emails"
      )
    );
  });

module.exports = {
  fetchFriends,
  createFriend,
  sendInvites,
};
