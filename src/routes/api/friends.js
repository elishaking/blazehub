const router = require('express').Router();
const passport = require('passport');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('../../utils/email');

const firebaseConfig = require('../../config/firebase');
const firebaseApp = app.initializeApp(firebaseConfig);

const dbRef = firebaseApp.database().ref();

/**
 * @route POST /api/friends
 * @description Send all user friends
 * @access Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  dbRef.child('friends').child(req.body.userKey).once('value', (friendsSnapShot) => {
    res.json({ friends: friendsSnapShot.val() });
  });
});

/**
 * @route POST /api/friends/add
 * @description Add a new friend
 * @access Private
 */
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
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
 * @route POST /api/friends/invite
 * @description Invite friends to Blazehub
 * @access Private
 */
router.post('/invite', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const invitees = req.body;
  if (invitees[0].email == '') return res.status(400).json({ success: false });

  let success = true;
  for (let i = 0; i < invitees.length; i++) {
    success = await sendInviteMail(req.user, invitees[i].email) && success;
  }

  res.json({ success });
});

module.exports = router;
