const router = require('express').Router();
const passport = require('passport');

const { getFriends, addFriend, inviteFriends } = require('../../controllers/friends');

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
router.post('/invite', passport.authenticate('jwt', { session: false }), inviteFriends);

module.exports = router;
