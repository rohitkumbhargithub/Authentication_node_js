const jwt = require('jsonwebtoken');

const generateJWTtoken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: "strict", 
        secure: process.env.NODE_ENV !== 'development'
    });
};

module.exports = generateJWTtoken;