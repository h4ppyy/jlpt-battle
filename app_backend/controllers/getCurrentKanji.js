const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/database.js');
const ioconfig   = require('../config/ioClient.js');
const common = require('./common.js');


exports.getCurrentKanji = function(req, res) {
    const connection = mysql.createConnection(dbconfig);
    
    var sql = "select kanji from tbl_japan_problem x join tbl_japan_store y on x.store_id = y.id where x.regist_date > DATE_FORMAT(date_sub(now(), interval 1 day),'%Y-%m-%d') order by x.regist_date desc limit 1"
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
