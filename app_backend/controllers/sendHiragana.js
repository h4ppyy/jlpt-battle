const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


// 정답 제출 시 호출되는 함수
exports.sendHiragana = function(req, res) {
    const conn = mysql.createConnection(dbconfig);
    const ioClient = ioc.connect(ioconfig);

    var hiragana = req.body.hiragana;
    var level = req.body.level;
    var decoded = req.decoded;
    var id = decoded.id;
    var username = decoded.username;

    common.logging_debug('hiragana', hiragana);
    common.logging_debug('level', level);
    common.logging_debug('id', id);
    common.logging_debug('username', username);

    async.waterfall([
        // 1. 제출할 수 있는 문제가 존재하는지 확인
        // 2. 제출된 히라가나와 출제된 히라가나를 비교
        function(callback) {
            var sql = ""+
                      "select x.id, y.hiragana, y.level "+
                      "from tbl_problem_"+level+" x "+
                      "join tbl_japan_store y "+
                      "on x.store_id = y.id "+
                      "where user_id is null; "
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (err == null) {
                    var check = rows.length
                    common.logging_debug('check', check);
                    if(check != 0){
                        var problem_id = rows[0]['id']
                        var problem_hiragana = rows[0]['hiragana']
                        var problem_level = rows[0]['level']
                        callback(null, problem_id, problem_hiragana, problem_level);
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
        // 2. 정답일 경우 사용자가 문제를 획득
        function(problem_id, problem_hiragana, problem_level, callback) {
            common.logging_debug('problem_id', problem_id);
            common.logging_debug('problem_hiragana', problem_hiragana);
            common.logging_debug('problem_level', problem_level);

            if(hiragana == problem_hiragana){
                common.logging_debug('status', 'correct');
                var sql = ""+
                          "update tbl_problem_"+level+" "+
                          "set user_id = "+id+" "+
                          ", modify_date = now() " +
                          "where id = "+problem_id+" "
                common.logging_debug('sql', sql);
                conn.query(sql, function(err, rows, fields) {
                    if (err == null) {
                        callback(null, problem_level);
                    }
                    else {
                        common.logging_error('err', err);
                        conn.end()
                        return false;
                    }
                });
            } else {
                common.logging_debug('status', 'incorrect');
                res.json(
                  {
                    "result": common.CODE_PROBLEM_FAIL
                  }
                )
                conn.end()
                return false;
            }
        },
        // 3. 사용자에게 정답 제출 보상 포인트를 제공
        function(problem_level, callback) {
            var point = common.givePoint(problem_level);
            common.logging_debug('point', point);
            var sql = (SQL
                      `
                      update tbl_user
                      set point = point + ${point}
                      where id = ${id}
                      `
                      )
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (err == null) {
                    callback(null)
                }
                else {
                    common.logging_error('err', err);
                    conn.end()
                    return false;
                }
            });
        },
        // 4. 소켓을 이용하여 이력 동기화
        function(callback) {
            var channel_history = 'history_' + level;
            var channel_kanji = 'kanji_' + level;
            common.logging_debug('channel_history', channel_history);
            common.logging_debug('channel_kanji', channel_kanji);
            ioClient.emit(channel_history);
            ioClient.emit(channel_kanji, '');
            res.json(
              {
                "result": common.CODE_SUCCESS
              }
            )
            conn.end()
            return false;
        },
    ], function (err, result) {});
}
