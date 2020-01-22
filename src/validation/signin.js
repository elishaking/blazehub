const Validator = require('validator').default;
const isEmpty = require('./isEmpty');
const ErrorMessage = require('../utils/errorMessage');

const validateSigninData = (data) => {
  let errors = {};

  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;

  if (Validator.isEmpty(data.email)) {
    errors.signinEmail = ErrorMessage.RequireError('email')
  } else if (!Validator.isEmail(data.email)) {
    errors.signinEmail = ErrorMessage.InvalidError('email');
  }

  if (Validator.isEmpty(data.password)) {
    errors.signinPassword = ErrorMessage.RequireError('password');
  } else if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    errors.signinPassword = ErrorMessage.LengthError('password', 4, 30);
  }

  return {
    isValid: isEmpty(errors),
    errors: errors
  }
}

module.exports = validateSigninData;