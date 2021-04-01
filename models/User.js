const Sequelize = require ('sequelize');
const connection = require('../connection');
const bcrypt = require('bcrypt');
const validator = require('validator');

const User = connection.define('user', {
    id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        validate:{
            notEmpty:{
                args:true,
                msg:"Email Error: Email-is required"
            },
            isEmail:{
                args:true,
                msg:'Email Error: Valid email-is required'
            }
        },
        unique: {
            args:true,
            msg: 'Email Error: Email address already in use!'
        }
        
    },
    password: {
        type: Sequelize.STRING,
        validate:{
            notEmpty:{
                args:true,
                msg:"Password Error: Password is required"
            },
            len:{
                args:[6,50],
                msg:"Password Error: Password length is not in range"
            }
        } 
    }
});

User.beforeCreate(async (user)=>{
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(user.password, salt);
    user.password = encryptedPassword;
});

module.exports = User;