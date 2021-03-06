const Validator = require('validator').default;
const isEmpty = require('./isEmpty');
const ErrorMessage = require('../utils/errorMessage');

const validateSignupData = (data) => {
  let errors = {};

  data.firstName = isEmpty(data.firstName) ? '' : data.firstName;
  data.lastName = isEmpty(data.lastName) ? '' : data.lastName;
  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;

  if (data.firstName === '') {
    errors.firstName = ErrorMessage.RequireError('first name');
  } else if (typeof data.firstName !== 'string') {
    errors.firstName = ErrorMessage.InvalidError('first name');
  } else if (!Validator.isLength(data.firstName, { min: 2, max: 50 })) {
    errors.firstName = ErrorMessage.LengthError('first name', 2, 50);
  }

  if (data.lastName === '') {
    errors.lastName = ErrorMessage.RequireError('last name');
  } else if (typeof data.firstName !== 'string') {
    errors.lastName = ErrorMessage.InvalidError('last name');
  } else if (!Validator.isLength(data.lastName, { min: 2, max: 50 })) {
    errors.lastName = ErrorMessage.LengthError('last name', 2, 50);
  }

  if (data.email === '') {
    errors.email = ErrorMessage.RequireError('email');
  } else if (typeof data.firstName !== 'string') {
    errors.email = ErrorMessage.InvalidError('email');
  } else if (!Validator.isEmail(data.email)) {
    errors.email = ErrorMessage.InvalidError('email');
  }

  if (data.password === '') {
    errors.password = ErrorMessage.RequireError('password');
  } else if (typeof data.firstName !== 'string') {
    errors.password = ErrorMessage.InvalidError('password');
  } else if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    errors.password = ErrorMessage.LengthError('password', 4, 30);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  }
}

module.exports = validateSignupData;