const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


exports.getCurrentKanji = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    var sql = (SQL
              `
              select kanji
              from tbl_japan_problem x
              join tbl_japan_store y
              on x.store_id = y.id
              where x.regist_date > DATE_FORMAT(date_sub(now(), interval 10 day),'%Y-%m-%d')
              order by x.regist_date desc
              limit 1
              `
              )
    common.logging_debug('sql', sql);
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        // console.log('DEBUG -> rows : ', rows);
        res.json({"result": rows})
      }
      else {
        console.log('ERROR -> ', err);
        res.json({"result": [{'kanji':'null'}]})
      }
    });
}
