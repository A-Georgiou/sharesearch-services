const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
module.exports = async function(req, res, next){
    const token = req.cookies.token;

    if(!token) return res.status(401).send('Access Denied.');
    try{
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invalid Token.');
    }
}