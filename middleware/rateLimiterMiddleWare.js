// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimiter = require("express-rate-limit");

exports.limiter = (limit, message) =>
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: limit,
    message:
      message ||
      "Too many requests from this IP, please try again after 15 minutes.",
    statusCode: 429,
  });
