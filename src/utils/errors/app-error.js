class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.explanation = message;

    // // Capture stack trace
    // Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;