const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('../../utils/email');

const validateSignupData = require('../../validation/signup');
const validateSigninData = require('../../validation/signin');

const firebaseConfig = require('../../config/firebase');
const firebaseApp = app.initializeApp(firebaseConfig);

const dbRef = firebaseApp.database().ref();

const { signupUser, signinUser, getUsers } = require('../../controllers/users');

/**
 * @route POST api/users/signup
 * @description Register new user
 * @access Public
 */
router.post("/signup", signupUser);

/**
 * @route POST /api/users/signin
 * @description Authenticate user
 * @access Public
 */
router.post('/signin', signinUser);

/**
 * @route GET /api/users/
 * @description Send All users
 * @access Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), getUsers);

//@route GET /api/users/token
//@description Send Auth token
//@access Private
// router.get('/token', passport.authenticate('jwt', { session: false }), (req, res) => {
//   console.log(req.user.id);
//   dbRef.child('tokens').child(req.user.id).once("value", (userToken) => {
//     if (userToken.exists()) return res.json({ token: userToken.val() });

//     res.json({ token: null });
//   });
// });

/**
 * @route GET /api/users/firebase
 * @description Send firebase credentials
 * @access Private
 */
router.get('/firebase', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(firebaseConfig);
});

/**
 * @route POST /api/users/friends
 * @description Send all user friends
 * @access Private
 */
router.post('/friends', passport.authenticate('jwt', { session: false }), (req, res) => {
  dbRef.child('friends').child(req.body.userKey).once('value', (friendsSnapShot) => {
    res.json({ friends: friendsSnapShot.val() });
  });
});

/**
 * @route POST /api/users/friends/add
 * @description Add a new friend
 * @access Private
 */
router.post('/friends/add', passport.authenticate('jwt', { session: false }), (req, res) => {
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
  })
});

/**
 * @route POST /api/users/friends/invite
 * @description Invite friends to Blazehub
 * @access Private
 */
router.post('/friends/invite', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const invitees = req.body;
  if (invitees[0].email == '') return res.status(400).json({ success: false });

  let success = true;
  for (let i = 0; i < invitees.length; i++) {
    success = await sendInviteMail(req.user, invitees[i].email) && success;
  }

  res.json({ success });
});

module.exports = router;
