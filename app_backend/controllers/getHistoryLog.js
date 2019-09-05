const mysql = require('mysql');
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 현재 이력을 가져오는 함수
exports.getHistoryLog = function(req, res) {
    const connection = mysql.createConnection(dbconfig);
    const level = req.body.level;
    const sql = "SELECT Ifnull(y.username, 'PC') AS username, "+
              "Ifnull(x.modify_date, '정답 미제출로 인한 pass') AS modify_date, "+
              "z.kanji, "+
              "z.hiragana, "+
              "z.hangul "+
              "FROM   tbl_problem_"+level+" x "+
              "LEFT JOIN tbl_user y "+
              "ON x.user_id = y.id "+
              "JOIN tbl_japan_store z "+
              "ON x.store_id = z.id "+
              "WHERE  x.regist_date > Date_format(Date_sub(Now(), INTERVAL "+common.SLOW_QUERY_SOLUTION+" day), '%Y-%m-%d') "+
              "ORDER  BY x.regist_date DESC "+
              "LIMIT  11; "
    common.logging_debug('sql', sql);
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        res.json(
          {
            "result": rows
          }
        )
        connection.end()
        return false;
      }
      else {
        common.logging_error('err', err);
        res.json(
          {
            "result": []
          }
        )
        connection.end()
        return false;
      }
    });
}
