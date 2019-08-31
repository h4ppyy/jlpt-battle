const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/database.js');
const ioconfig   = require('../config/ioClient.js');
const common = require('./common.js');

const connection = mysql.createConnection(dbconfig);


exports.sendHiragana = function(req, res) {
    const ioClient = ioc.connect(ioconfig);

    var content = req.body.content;
    var user_id = '1';

    console.log('DEBUG -> content : ', content);
    console.log('DEBUG -> user_id : ', user_id);

    // あいそう
    async.waterfall([
        function(callback) {
            var sql = "select x.id, y.hiragana from tbl_japan_problem x join tbl_japan_store y on x.store_id = y.id where x.delete_yn = 'N' and x.regist_date > DATE_FORMAT(date_sub(now(), interval 1 day),'%Y-%m-%d') and user_id is null order by x.regist_date desc limit 1";
            console.log(sql);
            connection.query(sql, function(err, rows, fields) {
              if (err == null) {
                var id = rows[0]['id'];
                var hiragana = rows[0]['hiragana'];
                callback(null, id, hiragana);
              }
              else {
                console.log('ERROR -> ', err);
              }
            });
        },
        function(id, hiragana, callback) {
            console.log('DEBUG -> id : ', id);
            console.log('DEBUG -> hiragana : ', hiragana);

            if(content == hiragana){
              var sql = "update tbl_japan_problem set user_id = '"+user_id+"', modify_date = now() where id='"+id+"'"
              console.log(sql);
              connection.query(sql, function(err, rows, fields) {
                if (err == null) {
                  callback(null);
                }
                else {
                  console.log('ERROR -> ', err);
                }
              });
            } else {
                return false
            }
        },

        function(callback) {
            sql = 'select count(*) as cnt from tbl_japan_store'
            console.log(sql);
            connection.query(sql, function(err, rows, fields) {
              if (!err){
                len_rows = rows[0]['cnt'];
                callback(null, len_rows);
              } else {
                console.log('Error : ', err);
              }
            });
        },
        function(len_rows, callback) {
            console.log('rows : ', len_rows);
            var searchId = common.getRandom(len_rows);
            var sql = 'select * from tbl_japan_store where id = '+searchId+''
            console.log(sql);
            console.log('searchId : ', searchId);
            connection.query(sql, function(err, rows, fields) {
              if (!err){
                rows = rows[0];
                callback(null, rows);
              } else {
                console.log('Error : ', err);
              }
            });
        },
        function(rows, callback) {
            var id = rows['id'];
            var kanji = rows['kanji'];
            var hiragana = rows['hiragana'];
            var hangul = rows['hangul'];
            var type = rows['type'];
            var level = rows['level'];
            var exam_yn = rows['exam_yn'];
            var delete_yn = rows['delete_yn'];
            var regist_date = rows['regist_date'];
            var modify_date = rows['modify_date'];
            var delete_date = rows['delete_date'];

            console.log('id -> ', id);
            console.log('kanji -> ', kanji);
            console.log('hiragana -> ', hiragana);
            console.log('hangul -> ', hangul);
            console.log('type -> ', type);
            console.log('level -> ', level);
            console.log('exam_yn -> ', exam_yn);
            console.log('delete_yn -> ', delete_yn);
            console.log('regist_date -> ', regist_date);
            console.log('modify_date -> ', modify_date);
            console.log('delete_date -> ', delete_date);

            var sql = 'insert into tbl_japan_problem(store_id, user_id) values('+id+', null);'
            console.log(sql);
            connection.query(sql, function(err, rows, fields) {
              if (!err){
                //console.log('rows -> ', rows);
                callback(null, kanji);
              } else {
                console.log('Error : ', err);
              }
            });
        },
        function(kanji, callback) {
            ioClient.emit("kanji", kanji);
            ioClient.emit("history");
            callback(null, 'done');
        }
    ], function (err, result) {
          console.log('err -> ', err);
          console.log('result -> ', result);
    });

    res.json({"result": "1"})
}
