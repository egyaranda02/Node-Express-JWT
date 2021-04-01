var connection = require('../connection');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next)=>{

    const token = req.cookies.jwt;

    // checking jwt is exist and valid
    if(token){
        jwt.verify(token, 'This is a secret key', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}

// check user
const checkUser = (req, res, next)=>{
    console.log("Check user is running");
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'This is a secret key', async (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                let user = await User.findByPk(decodedToken.id);
                console.log(user);
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}



module.exports = { requireAuth, checkUser };