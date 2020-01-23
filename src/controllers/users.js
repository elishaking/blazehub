const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('firebase/app');
require('firebase/database');

const validateSignupData = require('../validation/signup');
const validateSigninData = require('../validation/signin');

const { createUser, authenticateUser } = require('../services/users');
const ResponseUtil = require('../utils/response');

const dbRef = app.database().ref();

/**
 * Create a new user and redirect to signin page
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const signupUser = (req, res) => {
  createUser(req.body)
    .then((responseData) => ResponseUtil.sendResponse(
      res,
      responseData
    ));
};

/**
 * Authenticates a user and responds with a token
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const signinUser = (req, res) => {
  authenticateUser(req.body)
    .then((responseData) => ResponseUtil.sendResponse(
      res,
      responseData
    ));
};

/**
 * Get all Users
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getUsers = (req, res) => {
  dbRef.child('users').limitToLast(30).once("value", (usersSnapshot) => res.json({
    users: usersSnapshot.val()
  }));
};

module.exports = {
  signupUser,
  signinUser,
  getUsers
};
