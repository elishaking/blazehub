const router = require("express").Router();
const passport = require("passport");

const { sendFeedbackEmail } = require("../../controllers/feedback");

/**
 * @route POST /api/feedback/send
 * @description Send feedback
 * @access Private
 */
router.post(
  "/send",
  passport.authenticate("jwt", { session: false }),
  sendFeedbackEmail
);

module.exports = router;
