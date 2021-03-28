var connection = require('../connection');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

module.exports.signup_get = (req, res)=>{
    res.render('signup');
}

module.exports.login_get = (req, res)=>{
    res.render('login');
}

module.exports.signup_post = async function(req, res){
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, 10);
    
    var post = {
        email: req.body.email,
        password: encryptedPassword
    }
    if(isEmail(post.email)){
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
                            res.send("New user created!");
                        }
                    })
                }else{
                    res.send("Email already used by another user");
                }
            }
        })
    }else{
        res.send('Please enter a valid email!');
    }
}

module.exports.login_post = (req, res)=>{
    res.send('User logged in!');
}
