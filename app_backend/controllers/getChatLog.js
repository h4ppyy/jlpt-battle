const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/database.js');
const ioconfig   = require('../config/ioClient.js');
const common = require('./common.js');


exports.getChatLog = function(req, res) {
    const connection = mysql.createConnection(dbconfig);
    
    var sql = 'select y.username, x.content, x.regist_date from tbl_chat x join tbl_user y on x.user_id = y.id order by regist_date desc limit 30';
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        // console.log('DEBUG -> rows : ', rows);
        res.json({"result": rows})
      }
      else {
        console.log('ERROR -> ', err);
      }
    });
}
