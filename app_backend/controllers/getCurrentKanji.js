const async = require('async');
const mysql = require('mysql');
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 현재 난이도의 출제 한자를 가져오는 함수
exports.getCurrentKanji = function(req, res) {
    const conn = mysql.createConnection(dbconfig);
    const level = req.body.level;

    // 레벨 별 회차를 얻어오는 쿼리
    if (level == 'n1'){
      var round_query = "select count(*) as cnt from tbl_japan_store where level=1 and check_each_yn = 'Y'"
      var rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n1'"
    } else if (level == 'n2'){
      var round_query = "select count(*) as cnt from tbl_japan_store where level=2 and check_each_yn = 'Y'"
      var rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n2'"
    } else if (level == 'n3'){
      var round_query = "select count(*) as cnt from tbl_japan_store where level=3 and check_each_yn = 'Y'"
      var rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n3'"
    } else if (level == 'n4'){
      var round_query = "select count(*) as cnt from tbl_japan_store where level=4 and check_each_yn = 'Y'"
      var rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n4'"
    } else if (level == 'n5'){
      var round_query = "select count(*) as cnt from tbl_japan_store where level=5 and check_each_yn = 'Y'"
      var rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_n5'"
    } else {
      var round_query = "select count(*) as cnt from tbl_japan_store where check_free_yn = 'Y'"
      var rotate_query = "select global_value from tbl_global_var where global_key = 'rotate_free'"
    }

    // 문제생성간격 시간을 얻어오는 쿼리
    var reload_query = "select global_value from tbl_global_var where global_key = 'reload_time'"

    // 현재 제출된 한자를 얻어오는 쿼리
    var kanji_sql =""+
             "SELECT kanji "+
             "FROM   tbl_problem_"+level+" x "+
             "JOIN tbl_japan_store y "+
             "ON x.store_id = y.id "+
             "WHERE  x.regist_date > Date_format(Date_sub(Now(), INTERVAL "+common.SLOW_QUERY_SOLUTION+" day), '%Y-%m-%d') "+
             "AND x.user_id is null "+
             "ORDER  BY x.regist_date DESC "+
             "LIMIT  1 ";

    common.logging_debug('round_query', round_query);
    common.logging_debug('rotate_query', rotate_query);
    common.logging_debug('kanji_sql', kanji_sql);

    async.waterfall([
        function(callback) {
            conn.query(rotate_query, function(err, rows, fields) {
              if (err == null) {
                  var rotateCnt = Number(rows[0]['global_value'])
                  common.logging_debug('rotateCnt', rotateCnt);
                  callback(null, rotateCnt);
              }
              else {
                common.logging_error('err', err);
                conn.end()
                return false;
              }
            });
        },
        function(rotateCnt, callback) {
            conn.query(round_query, function(err, rows, fields) {
              if (err == null) {
                  var roundCnt = rows[0]['cnt']
                  common.logging_debug('roundCnt', roundCnt);
                  callback(null, rotateCnt, roundCnt);
              }
              else {
                common.logging_error('err', err);
                conn.end()
                return false;
              }
            });
        },
        function(rotateCnt, roundCnt, callback) {
            conn.query(reload_query, function(err, rows, fields) {
              if (err == null) {
                  var reloadCnt = Number(rows[0]['global_value'])
                  common.logging_debug('reloadCnt', reloadCnt);
                  callback(null, rotateCnt, roundCnt, reloadCnt);
              }
              else {
                common.logging_error('err', err);
                conn.end()
                return false;
              }
            });
        },
        function(rotateCnt, roundCnt, reloadCnt, callback) {
            conn.query(kanji_sql, function(err, rows, fields) {
                if (err == null) {
                    if(rows.length != 0){
                        var kanji = rows[0]['kanji']
                        res.json(
                          {
                            "result": [
                              {
                                'kanji': kanji,
                                'rotateCnt': rotateCnt,
                                'roundCnt': roundCnt,
                                'reloadCnt': reloadCnt
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
                                'kanji': '',
                                'rotateCnt': rotateCnt,
                                'roundCnt': roundCnt,
                                'reloadCnt': reloadCnt
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
                          'kanji': '',
                          'rotateCnt': rotateCnt,
                          'roundCnt': roundCnt,
                          'reloadCnt': reloadCnt
                        }
                      ]
                    }
                  )
                  conn.end()
                  return false;
                }
            });
        }
    ], function (err, result) { /* pass */ });
}
