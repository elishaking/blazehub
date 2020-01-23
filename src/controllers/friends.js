const express = require('express');

const { fetchFriends, createFriend, sendInvites } = require('../services/friends');
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

  const data = {
    invitees,
    user: req.user
  };
  sendInvites(data)
    .then((responseData) => ResponseUtil.sendResponse(
      res,
      responseData
    ));
}

module.exports = {
  getFriends,
  addFriend,
  inviteFriends
};
