var connection = require('../connection');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validator = require('validator');
const User = require('../models/User');
const e = require('express');
const maxAge = 60 * 60 * 5;


const handleErrors = (err)=>{
    let error = { email: '', password:''};
}

const createToken = (id) =>{
    return jwt.sign({id}, 'This is a secret key', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res)=>{
    res.render('signup');
}

module.exports.login_get = (req, res)=>{
    res.render('login');
}

module.exports.signup_post = async function(req, res){
    const { email, password } = req.body;

    try{
        const user = await User.create( {email, password} );
        const token = createToken(user.id_user);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user.id_user});
    }catch(err){
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
            success: false,
            msg: err.errors.map(e => e.message)
            });
        }
    }
}

module.exports.login_post = (req, res)=>{
    User.findOne({ where: { email: req.body.email }})
        .then(user=>{
            if(user){
                var comparison = bcrypt.compareSync(req.body.password, user.password);
                if(comparison){
                    const token = createToken(user.id_user);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
                    res.status(201).json( {user: user.id_user} );
                    console.log("Login Success!");
                }else{
                    res.status(400).json({passwordErrors: "Email and Password doesn't match"})
                }
            }else{
                res.status(400).json({emailErrors: "Email doesn't exists"});
            }
        });

}

module.exports.logout_get = (req, res)=>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}
