const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/stock_favourite', verify, async (req, res) => {
    console.log('getting favourite');
    const token = req.cookies.token;
    if(!token) return res.status(401).send('Access Denied.');
    try{
        const user = await jwt.verify(token, process.env.TOKEN_SECRET);
        const existingUser = await User.findOne({_id: user._id});
        if(existingUser){
            await User.findOneAndUpdate({_id: user._id}, {$push: {favourites: req.body.favourite}}, {useFindAndModify: false});
            await res.status(200).send('good stuff');
        }else{
            res.status(400).send('invalid user');
        }
    }catch(err){
        res.status(400).send('cannot add to favourite');
    }
})

router.post('/stock_remove', verify, async (req,res) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).send('Access Denied.');
    try{
        const user = await jwt.verify(token, process.env.TOKEN_SECRET);
        const existingUser = User.findOne({_id: user._id});
        if(existingUser){
            await User.updateOne( {_id: user._id}, { $pullAll: {favourites: [req.body.favourite] } } );
            await res.status(200).send('great stuff');
        }else{
            res.status(401).send('invalid user');
        }
    }catch(err){
        res.status(400).send('cannot add to favourite');
    }
})

router.get('/favourites', verify, async (req, res) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).send('Access Denied.');
    try{
        const user = await jwt.verify(token, process.env.TOKEN_SECRET);
        const existingUser = await User.findOne({ _id: user._id}, 'favourites', function (err, favourite) {
            return res.send(favourite);
        });
    }catch(err){
        res.status(400).send('cannot add to favourite');
    }
})

module.exports = router;