const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


exports.getUserRank = function(req, res) {
    console.log('1');
    common.logging_debug('2');
    const connection = mysql.createConnection(dbconfig);

    var sql = 'select @rownum := @rownum+1 AS rank, username, jlpt_level, point, regist_date from tbl_user, (select @rownum :=0) as r where delete_yn = "N" and is_staff = "0" order by point desc limit 100';
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        console.log('DEBUG -> rows : ', rows);
        common.logging_debug('rows===>', rows);
        res.json({"result": rows})
      }
      else {
        console.log('ERROR -> ', err);
      }
    });
}