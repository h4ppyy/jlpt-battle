const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
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

    async.waterfall([
        // 1. 회원 중복 체크
        function(callback) {
            var sql = "select count(*) as cnt from tbl_user where username = '"+username+"';";
            console.log('sql -> ', sql);
            connection.query(sql, function(err, rows, fields) {
                if (!err){
                    var user_cnt = rows[0].cnt;
                    if(user_cnt == 0) {
                      callback(null);
                    } else {
                      res.json({"result": 300})
                      return false;
                    }
                } else {
                    console.log('err : ', err);
                }
            });
        },
        // 2. 회원 가입
        function(callback) {
            var sql = "insert into tbl_user(username, password, jlpt_level) value('"+username+"', '"+password+"', '"+passwordRe+"');";
            console.log('sql -> ', sql);
            connection.query(sql, function(err, rows, fields) {
                if (!err){
                    res.json({"result": 200})
                    return false;
                } else {
                    console.log('err : ', err);
                }
            });
        }
    ], function (err, result) {
        console.log('err -> ', err);
        console.log('result -> ', result);
    });


}
