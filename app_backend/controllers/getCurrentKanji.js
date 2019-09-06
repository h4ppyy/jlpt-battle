const mysql = require('mysql');
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 현재 난이도의 출제 한자를 가져오는 함수
exports.getCurrentKanji = function(req, res) {
    const conn = mysql.createConnection(dbconfig);
    const level = req.body.level;
    const sql =""+
             "SELECT kanji "+
             "FROM   tbl_problem_"+level+" x "+
             "JOIN tbl_japan_store y "+
             "ON x.store_id = y.id "+
             "WHERE  x.regist_date > Date_format(Date_sub(Now(), INTERVAL "+common.SLOW_QUERY_SOLUTION+" day), '%Y-%m-%d') "+
             "AND x.user_id is null "+
             "ORDER  BY x.regist_date DESC "+
             "LIMIT  1 ";
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
      if (err == null) {
          if(rows.length != 0){
              var kanji = rows[0]['kanji']
              res.json(
                {
                  "result": [
                    {
                      'kanji': kanji
                    }
                  ]
                }
              )
              conn.end()
              return false;
          } else {
              res.json(
                {
                  "result": [
                    {
                      'kanji': ''
                    }
                  ]
                }
              )
              conn.end()
              return false;
          }
      }
      else {
        common.logging_error('err', err);
        res.json(
          {
            "result": [
              {
                'kanji': ''
              }
            ]
          }
        )
        conn.end()
        return false;
      }
    });
}
