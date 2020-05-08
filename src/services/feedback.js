const { sendFeedbackMail } = require("../utils/email");
const ResponseUtil = require("../utils/response");

/**
 * Sends feedback to admin email
 * @param {{name: string; email: string; message: string;}} feedbackData
 */
const sendFeedback = (feedbackData) =>
  new Promise(async (resolve) => {
    let success = await sendFeedbackMail(feedbackData);

    resolve(
      ResponseUtil.createResponse(
        success,
        success ? 200 : 500,
        success ? "Feedback Sent" : "Could not send feedback"
      )
    );
  });
