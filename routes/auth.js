const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {
    loginValidation,
    registerValidation,
    emailValidation
} = require('../validation');
const generateToken = require('./generateToken');
const verify = require('./verifyToken');

//REGISTER ROUTER

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check user exists
    const emailExist = await User.findOne({
        email: req.body.email
    });
    if (emailExist) return res.status(400).send('User already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    //Add to database
    try {
        const savedUser = await user.save();
        await generateToken(res, user._id, user.name);
    } catch (err) {
        res.status(400).send(err);
    }
});


router.post('/register/validateEmail', async(req, res) => {
    if(req.body.email == '') return res.send({responseText: '', valid: ''}) 

    const { error } = emailValidation(req.body);
    if (error) return res.send({responseText: error.details[0].message, valid: 'invalid'});

    //Check user exists
    const emailExist = await User.findOne({
        email: req.body.email
    });

    if (emailExist) return res.send({responseText: 'Email already in use', valid: 'invalid'});

    res.send({responseText: 'Valid Email', valid: 'valid'});
})


//LOGIN ROUTER

router.post('/login', async (req, res) => {
    //VALIDATE CONTENT
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    try{
    //GET EMAIL
    const user = await User.findOne({  email: req.body.email });
    if (!user) return res.status(400).send('Account not found.');

    //CHECK PASSWORD
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Incorrect password.');

    await generateToken(res, user._id, user.name);
    }catch(err){
        return res.status(400).json(err.toString());
    }
});

router.post('/logout', verify, async (req, res) => {
    return res.clearCookie("token").sendStatus(200);
})

router.get('/user_info', verify, async (req, res) => {
    const user = await User.findOne({_id: req.user._id});
    const keyUserInfo = {_id: user._id, email: user.email, name: user.name}
    res.send(keyUserInfo);
})


module.exports = router;