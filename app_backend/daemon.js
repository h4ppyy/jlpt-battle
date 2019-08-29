const mysql = require('mysql');
const async = require( "async" );
const io = require("socket.io-client");
const ioClient = io.connect("http://localhost:4000");
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);
const MIL_SEC = 1000;
const RESATRT_SEC = 30;


// 1 <= target <= max
function getRandom(max) {
  return Math.floor((Math.random()*max)+1);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let main = () => new Promise((resolve) => {
    async.waterfall([
      function(callback) {
        sql = 'select count(*) as cnt from tbl_japan_store'
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
          var searchId = getRandom(len_rows);
          var sql = 'select * from tbl_japan_store where id = '+searchId+''

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
          connection.query(sql, function(err, rows, fields) {
            if (!err){
              console.log('rows -> ', rows);
              callback(null, kanji);
            } else {
              console.log('Error : ', err);
            }
          });
      },
      function(kanji, callback) {
          console.log('kanji : ', kanji);
          ioClient.emit("kanji", kanji);
          callback(null, 'done');
      }
  ], function (err, result) {
      console.log('error -> ', err);
      console.log('result -> ', result);
      if(err == null && result == 'done'){
        resolve('end');
      }
  });
});


async function batch() {
  while (true) {
    ret = await main();
    if(ret == 'end'){
      console.log('end')
    }
    await sleep(MIL_SEC * RESATRT_SEC);
  }
}


batch();
