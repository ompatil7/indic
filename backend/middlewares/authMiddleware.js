
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.userId);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user; // Attach the user to the request object
            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};