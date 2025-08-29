const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { ServerConfig } = require('../config');

module.exports = function (req, res, next) {
    console.log(req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication token missing' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, ServerConfig.JWT_SECRET);
        req.user = user; // Attach user info to request
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};