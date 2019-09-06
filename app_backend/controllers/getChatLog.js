const mysql = require('mysql');
const SQL = require('sql-template-strings')
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 채팅로그를 가져오기 위해 호출되는 함수
exports.getChatLog = function(req, res) {
    const conn = mysql.createconn(dbconfig);
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
    conn.query(sql, function(err, rows, fields) {
      if (err == null) {
        res.json({"result": rows})
        conn.end()
        return false;
      }
      else {
        common.logging_error('err', err);
        conn.end()
        return false;
      }
    });
}
