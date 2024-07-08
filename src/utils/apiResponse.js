module.exports = {
  /**
   * Handle Success
   * Returns a function that sends a success response with the given data.
   *
   * @param {any} data - The data to be sent in the response.
   * @param {number} [statusCode=200] - The HTTP status code of the response.
   * @returns {function} - A function that handles the HTTP response.
   */
  success: (data, statusCode = 200) => {
    // Return a function that handles the HTTP response
    return (req, res) => {
      // Send the response with the given status code
      res.status(statusCode).json(data);
    };
  },

  /**
   * Handle Error
   * Returns a function that sends an error response with the given error details.
   *
   * @param {Error} error - The error object.
   * @param {string} message - The error message.
   * @param {number} [statusCode=500] - The HTTP status code of the response.
   * @returns {function} - A function that handles the HTTP response.
   */
  error: (error, message, statusCode = 500) => {
    // Log the error
    console.log(error);

    // Return a function that handles the HTTP response
    return (req, res) => {
      // Create the error response object
      const errorResponse = {
        success: false,
        error: {
          message: message, // Set the error message
          reason: error.message, // Set the reason for the error
        },
      };

      // Send the error response with the given status code
      res.status(statusCode).json(errorResponse);
    };
  },
};
