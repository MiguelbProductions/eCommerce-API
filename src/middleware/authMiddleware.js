const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token:', token);  // Log do token

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded:', decoded);  // Log do token decodificado

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error('User not found');  // Log se o usuário não for encontrado
                return res.status(401).json({ message: 'User not found' });
            }

            console.log('Authenticated user:', req.user);  // Log do usuário autenticado
            next();
        } catch (error) {
            console.error('Error during authentication:', error.message);  // Log de erro
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.error('No token provided');  // Log se nenhum token for encontrado
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


module.exports = { protect };
