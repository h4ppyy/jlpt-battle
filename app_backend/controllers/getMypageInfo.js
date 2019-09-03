const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


function levelClassification(rows){
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


exports.getMypageInfo = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    async.waterfall([
        function(callback) {
            var sql = (SQL
                      `
                      select username, jlpt_level, point, regist_date
                      from tbl_user
                      where id = '1'
                      `
                      )
            common.logging_debug('sql', sql);
            connection.query(sql, function(err, rows, fields) {
                if (err == null) {
                    if(rows.length != 0){
                        var user = rows[0]
                        callback(null, user);
                    } else {
                        res.json({"result": 404})
                        return false;
                    }
                }
                else {
                    common.logging_error('err', err);
                    return false;
                }
            });
        },
        function(user, callback) {
            var sql = (SQL
                      `
                      select level, count(*) as cnt
                      from tbl_japan_problem x
                      join tbl_japan_store y
                      on x.store_id = y.id
                      where user_id = '1'
                      group by level;
                      `
                      )
            common.logging_debug('sql', sql);
            connection.query(sql, function(err, rows, fields) {
                if (err == null) {
                    if(rows.length != 0){
                        var result = levelClassification(rows)
                        res.json(
                          {
                            "result": 200,
                            "userInfo": user,
                            "problemSolve": result
                          }
                        )
                        return false;
                    } else {
                        res.json({"result": 404})
                        return false;
                    }
                }
                else {
                    common.logging_error('err', err);
                    return false;
                }
            });
        },
    ], function (err, result) {
        // pass
    });


}
