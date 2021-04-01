var mysql = require('mysql');
const Sequelize = require('sequelize');

// Koneksi db sequelize
const conn = new Sequelize('auth', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

// cek koneksi sequelize
conn.authenticate()
    .then( ()=> console.log('Database Connected') )
    .catch( err => console.log(err) )


// // koneksi db
// const conn = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'auth'
// })

// conn.connect((err)=>{
//     if(err) throw err;
//     console.log('MySQL connected');
// });

module.exports = conn;