import jwt from 'jsonwebtoken';
const userSecretKey = 'USERSECRETKEY';

export const verifyUserToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], userSecretKey); 
        req.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
