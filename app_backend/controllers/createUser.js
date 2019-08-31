const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/database.js');
const ioconfig   = require('../config/ioClient.js');
const common = require('./common.js');


exports.createUser = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    var username = req.body.username;
    var password = req.body.password;
    var passwordRe = req.body.passwordRe;
    var jlptLevel = req.body.jlptLevel;

    console.log('username -> ', username);
    console.log('password -> ', password);
    console.log('passwordRe -> ', passwordRe);
    console.log('jlptLevel -> ', jlptLevel);

    var sql = 'insert into tbl_user(username, password, jlpt_level) value('+username+', '+password+', '+passwordRe+');';
    connection.query(sql, function(err, rows, fields) {
        if (!err){
            callback(null, rows);
        } else {
            console.log('Error : ', err);
        }
    });
    res.json({"result": 200})
}
