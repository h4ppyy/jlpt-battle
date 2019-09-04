const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


exports.getHistoryLog = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    var sql = (SQL
              `
              select ifnull(y.username, 'PC') as username,
                     ifnull(x.modify_date, '정답 미제출로 인한 pass') as modify_date,
                     z.kanji,
                     z.hiragana,
                     z.hangul
              from tbl_japan_problem x
              left join tbl_user y
              on x.user_id = y.id
              join tbl_japan_store z
              on x.store_id = z.id
              where x.regist_date > DATE_FORMAT(date_sub(now(), interval 10 day),'%Y-%m-%d')
              order by x.regist_date desc
              limit 11
              `
              )
    common.logging_debug('sql', sql);
    common.logging_debug('sql', sql);
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        // console.log('DEBUG -> rows : ', rows);
        res.json({"result": rows})
      }
      else {
        console.log('ERROR -> ', err);
        res.json({"result": []})
      }
    });
}
