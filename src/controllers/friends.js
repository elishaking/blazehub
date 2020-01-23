const express = require('express');

const sendInviteMail = require('../utils/email');

const { fetchFriends, createFriend } = require('../services/friends');
const ResponseUtil = require('../utils/response');

/**
 * Get all friends
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getFriends = (req, res) => {
  fetchFriends(req.body.userKey)
    .then((responseData) => ResponseUtil.sendResponse(
      res,
      responseData
    ));
};

/**
 * Add a new friend
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const addFriend = (req, res) => {
  const { userKey, friendKey, friend } = req.body;

  const data = { userKey, friendKey, friend, user: req.user };
  createFriend(data)
    .then((responseData) => ResponseUtil.sendResponse(
      res,
      responseData
    ));
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
