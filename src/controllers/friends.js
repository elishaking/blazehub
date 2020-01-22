const express = require('express');
const passport = require('passport');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('../utils/email');

const firebaseConfig = require('../config/firebase');
const firebaseApp = app.initializeApp(firebaseConfig);

const dbRef = firebaseApp.database().ref();

/**
 * Get all friends
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getFriends = (req, res) => {
  dbRef.child('friends').child(req.body.userKey).once('value', (friendsSnapShot) => {
    res.json({ friends: friendsSnapShot.val() });
  });
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

module.exports = {
  getFriends,
  addFriend
};
