const express = require("express");

const { sendFeedback } = require("../services/feedback");
const ResponseUtil = require("../utils/response");

/**
 * Send feedback
 * @param {express.Request} req
 * @param {express.Response} res
 */
const sendFeedbackEmail = async (req, res) => {
  const feedbackData = req.body;

  sendFeedback(feedbackData).then((responseData) =>
    ResponseUtil.sendResponse(res, responseData)
  );
};

module.exports = { sendFeedbackEmail };
