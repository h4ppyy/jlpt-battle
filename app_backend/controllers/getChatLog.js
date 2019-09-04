const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


exports.getChatLog = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    var sql = (SQL
              `
              select y.username, x.content, x.regist_date
              from tbl_chat x
              join tbl_user y
              on x.user_id = y.id
              order by regist_date desc
              limit 30
              `
              )
    common.logging_debug('sql', sql);
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        console.log('DEBUG -> rows : ', rows);
        res.json({"result": rows})
      }
      else {
        console.log('ERROR -> ', err);
      }
    });
}
