const jwt = require('jsonwebtoken');

const createToken = (payLoad) =>
    jwt.sign({ userId: payLoad }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });


module.exports = createToken;    