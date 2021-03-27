var mysql = require('mysql');

// koneksi db
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'auth'
})

conn.connect((err)=>{
    if(err) throw err;
    console.log('MySQL connected');
});

module.exports = conn;