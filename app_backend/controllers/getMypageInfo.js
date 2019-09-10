const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


function levelClassification(rows, eachCount){
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;
    var n5 = 0;

    

    for(i=0; i<rows.length; i++){
      var level = rows[i].level;
      var cnt = rows[i].cnt;

      if(level == 1) {
        n1 = cnt;
      } else if(level == 2) {
        n2 = cnt;
      } else if(level == 3) {
        n3 = cnt;
      } else if(level == 4) {
        n4 = cnt;
      } else if(level == 5) {
        n5 = cnt;
      }
    }
    n1 += eachCount.level1Count;
    n2 += eachCount.level2Count;
    n3 += eachCount.level3Count;
    n4 += eachCount.level4Count;
    n5 += eachCount.level5Count;

    common.logging_debug('n1', n1);
    common.logging_debug('n2', n2);
    common.logging_debug('n3', n3);
    common.logging_debug('n4', n4);
    common.logging_debug('n5', n5);

    var solveList = [n1, n2, n3, n4, n5];
    var max = Math.max.apply(null, solveList);
    var progress_n1 = Number((Number((n1 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n2 = Number((Number((n2 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n3 = Number((Number((n3 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n4 = Number((Number((n4 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n5 = Number((Number((n5 / max).toFixed(2)) * 100).toFixed(0));

    common.logging_debug('max', max);
    common.logging_debug('progress_n1', progress_n1);
    common.logging_debug('progress_n2', progress_n2);
    common.logging_debug('progress_n3', progress_n3);
    common.logging_debug('progress_n4', progress_n4);
    common.logging_debug('progress_n5', progress_n5);

    return {
        'n1': n1,
        'n2': n2,
        'n3': n3,
        'n4': n4,
        'n5': n5,
        'progress_n1': progress_n1,
        'progress_n2': progress_n2,
        'progress_n3': progress_n3,
        'progress_n4': progress_n4,
        'progress_n5': progress_n5,
    };
}
function zerolevel(eachCount) {
    var n1 = 0;
    var n2 = 0;
    var n3 = 0;
    var n4 = 0;
    var n5 = 0;

    n1 += eachCount.level1Count;
    n2 += eachCount.level2Count;
    n3 += eachCount.level3Count;
    n4 += eachCount.level4Count;
    n5 += eachCount.level5Count;
    

    var solveList = [n1, n2, n3, n4, n5];
    var max = Math.max.apply(null, solveList);
    var progress_n1 = Number((Number((n1 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n2 = Number((Number((n2 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n3 = Number((Number((n3 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n4 = Number((Number((n4 / max).toFixed(2)) * 100).toFixed(0));
    var progress_n5 = Number((Number((n5 / max).toFixed(2)) * 100).toFixed(0));

    return {
        'n1': n1,
        'n2': n2,
        'n3': n3,
        'n4': n4,
        'n5': n5,
        'progress_n1': progress_n1,
        'progress_n2': progress_n2,
        'progress_n3': progress_n3,
        'progress_n4': progress_n4,
        'progress_n5': progress_n5,
    };
}



exports.getMypageInfo = function(req, res) {
    console.log('decoded -> ', req.decoded);
    console.log('decoded id->', req.decoded.id);
    var username = req.decoded.username;
    var seq = req.decoded.id;
    const conn = mysql.createConnection(dbconfig);
    async.waterfall([
        function(callback) {
            var sql = (SQL
                      `
                      select username, jlpt_level, point, regist_date
                      from tbl_user
                      where id = ${seq}
                      `
                      )
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (err == null) {
                    var check = rows.length
                    common.logging_debug('check', check);
                    if(check != 0){
                        var user = rows[0]
                        callback(null, user);
                    } else {
                        res.json(
                          {
                            "result": common.CODE_PROBLEM_NULL
                          }
                        )
                        conn.end()
                        return false;
                    }
                }
                else {
                    common.logging_error('err', err);
                    conn.end()
                    return false;
                }
            });
        },
        function(user, callback) {
            common.logging_debug('user', user);

            common.logging_debug('status', 'correct');
            var sql = (SQL
                    `
                            SELECT
                              (SELECT COUNT(*) FROM tbl_problem_n1 WHERE user_id = ${seq}) as level1Count, 
                              (SELECT COUNT(*) FROM tbl_problem_n2 WHERE user_id = ${seq}) as level2Count,
                              (SELECT COUNT(*) FROM tbl_problem_n3 WHERE user_id = ${seq}) as level3Count,
                              (SELECT COUNT(*) FROM tbl_problem_n4 WHERE user_id = ${seq}) as level4Count,
                              (SELECT COUNT(*) FROM tbl_problem_n5 WHERE user_id = ${seq}) as level5Count;
                          `
            )
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (err == null) {
                    var eachCount = rows[0];
                    common.logging_error('eachCount ==>', eachCount);
                    callback(null, eachCount, user)
                }
                else {
                    common.logging_error('err', err);
                    conn.end()
                    return false;
                }
            });
        },
        function(eachCount, user, callback) {
            var sql = (SQL
                      `
                      select level, count(*) as cnt
                      from tbl_problem_free x
                      join tbl_japan_store y
                      on x.store_id = y.id
                      where user_id = ${seq}
                      group by level;
                      `
                      )
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (err == null) {
                    if(rows.length != 0){
                        var problemSolve = levelClassification(rows, eachCount)
                        res.json(
                            {
                                "result": common.CODE_SUCCESS,
                                "problemSolve": problemSolve,
                                "user": user
                            }
                        )
                        return false;
                    } else {
                        var problemSolve = zerolevel(eachCount);
                        res.json(
                            {
                                "result": common.CODE_SUCCESS,
                                "problemSolve": problemSolve,
                                "user": user
                            }
                        )
                        return false;
                    }

                }
                else {
                    common.logging_error('err', err);
                    return false;
                }
            });
        },
    ], function (err, result) {});


}
