const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateSigninData = (data) => {
  let errors = {};

  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;

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
    isValid: isEmpty(errors),
    errors: errors
  }
}

module.exports = validateSigninData;