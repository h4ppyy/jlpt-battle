const mysql = require('mysql');
const SQL = require('sql-template-strings')
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


exports.getUserRank = function(req, res) {
    const conn = mysql.createConnection(dbconfig);

    var sql = (SQL
              `
              select @rownum := @rownum+1 AS rank,
                    username,
                    jlpt_level,
                    point,
                    regist_date
              from tbl_user, (select @rownum :=0) as r
              where delete_yn = "N"
              order by point desc
              limit 100
              `
              )
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
      if (err == null) {
        common.logging_debug('rows', rows);
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
