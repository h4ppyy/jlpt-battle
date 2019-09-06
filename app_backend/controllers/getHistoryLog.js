const mysql = require('mysql');
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 제출된 문제가 있는지 확인하는 함수
function checkProblem(conn, level) {
  return new Promise(resolve => {
    var sql = ""+
              "select count(*) as cnt " +
              "from tbl_problem_"+level+" "+
              "where user_id is null "
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (!err){
            var status = rows[0].cnt;
            resolve(status);
        } else {
            common.logging_error('err', err);
            conn.end();
            return false;
        }
    });
  });
}


// 이력을 가져오는 함수
function getHistory(conn, level, status) {
    return new Promise(resolve => {
        if(status == 0){
            var sql = "SELECT Ifnull(y.username, 'PC') AS username, "+
                        "Ifnull(x.modify_date, '0000-00-00 00:00:00') AS modify_date, "+
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
                        "LIMIT  10; "
        } else {
            var sql = "SELECT Ifnull(y.username, 'PC') AS username, "+
                        "Ifnull(x.modify_date, '0000-00-00 00:00:00') AS modify_date, "+
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
        }
        common.logging_debug('sql', sql);
        conn.query(sql, function(err, rows, fields) {
            if (err == null) {
                if(status == 0){
                    // pass
                } else {
                    rows.shift();
                }
                conn.end();
                resolve(rows);
            }
            else {
                common.logging_error('err', err);
                conn.end();
                return false;
            }
        });
    });
}


// await 관리 함수
async function main(conn, level) {
  const status = await checkProblem(conn, level);
  const rows = await getHistory(conn, level, status);
  return rows;
}


// 현재 이력을 가져오는 함수
exports.getHistoryLog = function(req, res) {
    const conn = mysql.createConnection(dbconfig);
    const level = req.body.level;

    main(conn, level).then(rows => {
        common.logging_debug('rows', rows);
        res.json({"result": rows});
    })
}
