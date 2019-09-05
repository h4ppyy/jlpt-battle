const mysql = require('mysql');
const SQL = require('sql-template-strings')
const dbconfig   = require('../config/config.js').database;
const common = require('./common.js');


// 로그인 시 호출되는 함수
exports.loginUser = function(req, res) {
    const connection = mysql.createConnection(dbconfig);

    var username = req.body.username;
    var password = req.body.password;
    common.logging_debug('username', username);
    common.logging_debug('password', password);

    // 사용자명 (한글 / 영어 / 숫자 허용)
    before_username = username;
    username = username.replace(/[^(ㄱ-힣a-zA-Z0-9)]/gi, '')
    common.logging_debug('username (filter)', username);

    // 패스워드 (영어 / 숫자 / 특수문자(!@$%^&*()-=~) 허용)
    before_password = password;
    password = password.replace(/[^(a-zA-Z0-9!@$%^&*()-=~)]/gi, '')
    common.logging_debug('password (filter)', password);

    // 유효성 로직 (프론트 엔드와 동기화)
    if(before_username != username){
        res.json({"result": common.CODE_ID_NOT_ALLOW})
        connection.end()
        return false;
    }
    else if(before_password != password){
        res.json({"result": common.CODE_PW_NOT_ALLOW})
        connection.end()
        return false;
    }

    var sql = (SQL
              `
              select id, username, is_staff, count(*) as cnt
              from tbl_user
              where username = ${username}
              and password = ${password}
              group by id, username, is_staff;
              `
              )
    common.logging_debug('sql', sql);

    connection.query(sql, function(err, rows, fields) {
        if (!err){
            if(rows.length != 0){
                var id = rows[0].id;
                var username = rows[0].username;
                var is_staff = rows[0].is_staff;
                var cnt = rows[0].cnt;
                var jwttoken = common.getToken(id, username, is_staff);
                common.logging_debug('jwttoken', jwttoken);
                res.json({"token": jwttoken,"result": common.CODE_SUCCESS})
                connection.end()
                return false;
            } else {
                res.json({"result": common.CODE_ID_OR_PW_INCORRECT})
                connection.end()
                return false;
            }
        } else {
            common.logging_error('err', err);
            connection.end()
            return false;
        }
    });
}
