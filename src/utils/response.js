const ResponseUtil = {
  /**
   * @param {boolean} success
   * @param {string} statusCode
   * @param {string} message
   * @param {any} data
   */
  createResponse: (success, statusCode, message, data = undefined) => ({
    success,
    statusCode,
    message,
    data
  })
};

module.exports = ResponseUtil;
