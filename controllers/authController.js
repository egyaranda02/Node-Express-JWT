var connection = require('../connection');
var mysql = require('mysql');

module.exports.signup_get = (req, res)=>{
    res.render('signup');
}

module.exports.login_get = (req, res)=>{
    res.render('login');
}

module.exports.signup_post = (req, res)=>{
    var post = {
        email: req.body.email,
        password: req.body.password
    }
    var query = "SELECT email FROM ?? WHERE ?? = ?";
    var table = ["users", "email", post.email];
    query = mysql.format(query, table);
    console.log(post);

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
    
}

module.exports.login_post = (req, res)=>{
    res.send('User logged in!');
}
