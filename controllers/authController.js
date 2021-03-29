var connection = require('../connection');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validator = require('validator');
const maxAge = 60 * 60 * 5;

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

module.exports.signup_post = function(req, res){
    var post = {
        email: req.body.email,
        password: req.body.password
    }
    bcrypt.hash(post.password, saltRounds, function(err, hash) {
        if(validator.isEmail(post.email)){
            post.password = hash;
            var query = "SELECT email FROM ?? WHERE ?? = ?";
            var table = ["users", "email", post.email];
            query = mysql.format(query, table);
            connection.query(query, function(error, rows){
                if(error){
                    console.log(error);
                }else{
                    if(rows.length == 0 ){
                        var query = "INSERT INTO ?? SET ?";
                        var table = ["users"];
                        query = mysql.format(query, table);
                        connection.query(query, post, function(error, rows){
                            if(error){
                                console.log(error);
                            }else{
                                const token = createToken(rows.insertId);
                                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
                                res.status(201).json({ user: rows.insertId });
                            }
                        });
                    }else{
                        res.status(400).json({errors: 'Email already been used by another user!'});
                    }
                }
            })
        }else{
            res.status(400).json({errors: 'Please enter a valid email!'});
        }
    });
}

module.exports.login_post = (req, res)=>{
    res.send('User logged in!');
}
