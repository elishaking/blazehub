const ErrorMessage = {
  /**
   * @param {string} field
   */
  RequireError: (field) => `Your ${field} is required`,

  /**
   * @param {string} field
   */
  InvalidError: (field) => `Please enter a valid ${field}`,

  /**
   * @param {string} field
   * @param {number} min
   * @param {number} max
   */
  LengthError: (field, min, max) => `Your ${field} must be between ${min} and ${max} characters`
};

module.exports = ErrorMessage;