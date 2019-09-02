const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const SQL = require('sql-template-strings')
const common = require('./common.js');



exports.loginUser = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    var username = req.body.username;
    var password = req.body.password;

    common.logging_debug('username', username);
    common.logging_debug('password', password);

    var sql = (SQL
              `
              select (select count(*) from tbl_user where username = ${username} and password = ${password}) as cnt, username, is_staff
              from tbl_user
              where username = ${username} and password = ${password};
              `
              )
    common.logging_debug('sql', sql);

    connection.query(sql, function(err, rows, fields) {
                if (!err){
                    var user_cnt = rows[0].cnt;
                    var user_name = rows[0].username;
                    var user_staff = rows[0].is_staff;
                    common.logging_debug('user_cnt', user_cnt);
                    if(user_cnt == 1) {
                      var jwttoken = common.getToken(user_name, user_staff);
                      common.logging_debug('jwttoken', jwttoken);
                      res.json({"token": jwttoken,"result": common.CODE_SUCCESS})
                      return false;
                    }
                    else if(user_cnt == 0){
                      res.json({"result": common.CODE_ID_OR_PW_INCORRECT})
                      return false;
                    }
                    else{
                        common.logging_error('err', err);
                        return false;
                    }
                } else {
                    common.logging_error('err', err);
                    return false;
                }
    });
}
