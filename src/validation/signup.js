const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateSignupData = (data) => {
  let errors = {};

  data.firstName = isEmpty(data.firstName) ? '' : data.firstName;
  data.lastName = isEmpty(data.lastName) ? '' : data.lastName;
  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'Your first name is required';
  } else if (!Validator.isLength(data.firstName, { min: 2, max: 50 })) {
    errors.firstName = 'Your first name must be between 2 and 50 characters';
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Your last name is required';
  } else if (!Validator.isLength(data.lastName, { min: 2, max: 50 })) {
    errors.lastName = 'Your last name must be between 2 and 50 characters';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Your email is required"
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email"
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Your password is required';
  } else if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    errors.password = 'Your password must be between 4 and 30 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  }
}

module.exports = validateSignupData;