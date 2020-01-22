const express = require('express');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('../utils/email');

const { fetchFriends } = require('../services/friends');

const dbRef = app.database().ref();

/**
 * Get all friends
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getFriends = (req, res) => {
  fetchFriends(req.body.userKey)
    .then();
};

/**
 * Add a new friend
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const addFriend = (req, res) => {
  const { userKey, friendKey, friend } = req.body;

  // add new-friend to current-user's friends db
  dbRef.child('friends').child(userKey).child(friendKey).set(friend, (err) => {
    if (err) console.error(err);

    // add current-user to new-friend's db
    const user = req.user;
    dbRef.child('friends').child(friendKey).child(userKey).set({
      name: `${user.firstName} ${user.lastName}`
    }, (err) => {
      if (err) console.error(err);

      res.json({
        friend: {
          [friendKey]: friend
        }
      });
    });
  });
};

/**
 * Invite friend(s) to BlazeHub
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const inviteFriends = async (req, res) => {
  const invitees = req.body;
  if (invitees[0].email == '') return res.status(400).json({ success: false });

  let success = true;
  for (let i = 0; i < invitees.length; i++) {
    success = await sendInviteMail(req.user, invitees[i].email) && success;
  }

  res.json({ success });
}

module.exports = {
  getFriends,
  addFriend,
  inviteFriends
};
