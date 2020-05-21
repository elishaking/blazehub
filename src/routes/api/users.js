const router = require("express").Router();
const passport = require("passport");
require("firebase/database");

const firebaseConfig = require("../../config/firebase");

const {
  signupUser,
  signinUser,
  confirmUser,
  resendConfirmationURL,
  getUsers,
} = require("../../controllers/users");

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
router.post("/signin", signinUser);

/**
 * @route POST /api/users/confirm
 * @description Confirm user
 * @access Public
 */
router.post("/confirm", confirmUser);

/**
 * @route POST /api/users/resend
 * @description Resends confirmation URL to user email
 * @access Public
 */
router.post("/resend", resendConfirmationURL);

/**
 * @route GET /api/users/
 * @description Send All users
 * @access Private
 */
router.get("/", passport.authenticate("jwt", { session: false }), getUsers);

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
router.get(
  "/firebase",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(firebaseConfig);
  }
);

module.exports = router;
