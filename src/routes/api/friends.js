const router = require('express').Router();
const passport = require('passport');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('../../utils/email');

const firebaseConfig = require('../../config/firebase');
const firebaseApp = app.initializeApp(firebaseConfig);

const { getFriends, addFriend } = require('../../controllers/friends');

/**
 * @route POST /api/friends
 * @description Send all user friends
 * @access Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), getFriends);

/**
 * @route POST /api/friends/add
 * @description Add a new friend
 * @access Private
 */
router.post('/add', passport.authenticate('jwt', { session: false }), addFriend);

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
