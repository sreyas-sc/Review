import jwt from 'jsonwebtoken';
// Secret key for user token
const userSecretKey = 'USERSECRETKEY';
// Middleware to verify user token
export const verifyUserToken = (req, res, next) => {
    const token = req.headers['authorization'];

    // Check if token is present
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    try {
        // Decode token
        const decoded = jwt.verify(token.split(' ')[1], userSecretKey); 
        req.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
