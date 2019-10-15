const Validator = require('validator');
import { checkEmpty } from './checkEmpty';

export const validateSignupData = (data) => {
  let errors = {};

  if (!Validator.isEmpty(checkEmpty(data.firstName))) {
    errors.firstName = 'Your first name is required';
  }
  if (!Validator.isLength(data.firstName, { min: 2, max: 50 })) {
    errors.firstName = 'Your first name must be between 2 and 50 characters';
  }

  if (!Validator.isEmpty(checkEmpty(data.lastName))) {
    errors.lastName = 'Your last name is required';
  }
  if (!Validator.isLength(data.lastName, { min: 2, max: 50 })) {
    errors.lastName = 'Your last name must be between 2 and 50 characters';
  }

  if (!Validator.isEmpty(checkEmpty(data.email))) {
    errors.email = "Your email is required"
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email"
  }

  if (!Validator.isEmpty(checkEmpty(data.password))) {
    errors.password = 'Your password is required';
  }
  if (!Validator.isLength(data.password, { min: 4, max: 30 })) {
    errors.password = 'Your password must be between 4 and 30 characters';
  }
}