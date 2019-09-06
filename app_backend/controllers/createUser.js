const async = require('async');
const mysql = require('mysql');
const SQL = require('sql-template-strings')
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 회원가입 시 호출되는 함수
exports.createUser = function(req, res) {
    const conn = mysql.createConnection(dbconfig);

    var username = req.body.username;
    var password = req.body.password;
    var passwordRe = req.body.passwordRe;
    var jlptLevel = req.body.jlptLevel;

    common.logging_debug('username', username);
    common.logging_debug('password', password);
    common.logging_debug('passwordRe', passwordRe);
    common.logging_debug('jlptLevel', jlptLevel);

    // 사용자명 (한글 / 영어 / 숫자 허용)
    before_username = username;
    username = username.replace(/[^(ㄱ-힣a-zA-Z0-9)]/gi, '')
    common.logging_debug('username (filter)', username);

    // 패스워드 (영어 / 숫자 / 특수문자(!@$%^&*()-=~) 허용)
    before_password = password;
    password = password.replace(/[^(a-zA-Z0-9!@$%^&*()-=~)]/gi, '')
    common.logging_debug('password (filter)', password);

    // 유효성 로직 (프론트 엔드와 동기화)
    if(username == ''){
        res.json({"result": common.CODE_ID_EMPTY})
        conn.end()
        return false;
    }
    else if(before_username != username){
        res.json({"result": common.CODE_ID_NOT_ALLOW})
        conn.end()
        return false;
    }
    else if(before_password != password){
        res.json({"result": common.CODE_PW_NOT_ALLOW})
        conn.end()
        return false;
    }
    else if( !(username.length > 3 && username.length < 11) ){
        res.json({"result": common.CODE_ID_LENGTH_ERROR})
        conn.end()
        return false;
    }
    else if(password == ''){
        res.json({"result": common.CODE_PW_EMPTY})
        conn.end()
        return false;
    }
    else if( !(password.length > 3 && password.length < 11) ){
        res.json({"result": common.CODE_PW_LENGTH_ERROR})
        conn.end()
        return false;
    }
    else if(passwordRe == ''){
        res.json({"result": common.CODE_PW_RE_EMPTY})
        conn.end()
        return false;
    }
    else if(passwordRe != password){
        res.json({"result": common.CODE_PW_PWRE_NOT_SAME})
        conn.end()
        return false;
    }
    else if(jlptLevel == ''){
        res.json({"result": common.CODE_JLPT_EMPTY})
        conn.end()
        return false;
    }

    async.waterfall([
        // 1. 회원 중복 체크
        function(callback) {
            var sql = (SQL
                      `
                      select count(*) as cnt
                      from tbl_user
                      where username = ${username}
                      `
                      )
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (!err){
                    var user_cnt = rows[0].cnt;
                    common.logging_debug('user_cnt', user_cnt);
                    if(user_cnt == 0) {
                      callback(null);
                    } else {
                      res.json({"result": common.CODE_ID_DUPLICATE})
                      conn.end()
                      return false;
                    }
                } else {
                    common.logging_error('err', err);
                    conn.end()
                    return false;
                }
            });
        },
        // 2. 회원 가입
        function(callback) {
            var sql = (SQL
                      `
                      insert into tbl_user(username, password, jlpt_level)
                      value(${username}, ${password}, ${jlptLevel})
                      `
                      )
            common.logging_debug('sql', sql);
            conn.query(sql, function(err, rows, fields) {
                if (!err){
                    res.json({"result": common.CODE_SUCCESS})
                    conn.end()
                    return false;
                } else {
                  common.logging_error('err', err);
                  conn.end()
                  return false;
                }
            });
        }
    ], function (err, result) {});
}
