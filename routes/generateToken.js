const jwt = require('jsonwebtoken');

const generateToken = (res, _id, name) => {
    const expiration = 1000;
    const token = jwt.sign({ _id, name }, process.env.TOKEN_SECRET,{
        expiresIn: '1d',
    });

    return res.cookie('token', token, {
        expires: false,
        secure: false,
        httpOnly: true
    }).sendStatus(200);
};

module.exports = generateToken

// generateToken.js file