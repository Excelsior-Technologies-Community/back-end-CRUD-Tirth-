const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Validates the token sent in the Authorization header.
 * Only lets the request proceed if a valid JWT is provided.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header string ("Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token signature using our server secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stocksyncjwtsecretkey2026');

            // Find user in database by decoded ID, excluding the hashed password
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, user not found'
                });
            }

            // Move to the next middleware or controller function
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, invalid token'
            });
        }
    }

    // If no token is provided
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }
};

module.exports = { protect };
