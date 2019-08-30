const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser')
var cors = require('cors')
var async = require('async')

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIO(server);
const ioc = require("socket.io-client");
const ioClient = ioc.connect("http://localhost:4000");

const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);


app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())


// 1 <= target <= max
function getRandom(max) {
  return Math.floor((Math.random()*max)+1);
}


function getDateTime() {
    var date = new Date();
    console.log('date -> ', date);
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + "-" + hour + ":" + min + ":" + sec;
}


// 테스트 로직
app.get('/', function(req, res) {

  connection.query('select * from tbl_user', function(err, rows, fields) {
    if (err == null) {
      console.log('The solution is: ', rows);
      ioClient.emit("chat", 'hello world');
    }
    else {
      console.log('Error while performing Query.', err);
    }
  });

  res.json({"result":200})
});


// 정답(히라가나) 제출 처리
app.post('/api/sendHiragana', cors(), function(req, res) {
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
          var searchId = getRandom(len_rows);
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
});


// 퍼센트 가져오기
app.post('/api/getProgress', cors(), function(req, res) {

  var sql = "select DATE_ADD(regist_date, INTERVAL 100 SECOND) as time from tbl_japan_problem where delete_yn = 'N' AND user_id IS NULL  ORDER BY regist_date DESC limit 1"
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      var time = rows[0]['time']; // UTC
      var now = new Date();       // KST

      console.log('DEBUG -> time : ', time);
      console.log('DEBUG -> time : ', typeof time);

      console.log('DEBUG -> now : ', now);
      console.log('DEBUG -> now : ', typeof now);

      var diff = Math.round((time - now) / 1000);
      console.log('DEBUG -> diff : ', diff);

      if(diff < 0){
        diff = 0
      }

      res.json({"result": diff})
    }
    else {
      console.log('ERROR -> ', err);
    }
  });
});


// 채팅 내역 최근 30개 가져오기
app.post('/api/getChatLog', cors(), function(req, res) {

  var sql = 'select y.username, x.content, x.regist_date from tbl_chat x join tbl_user y on x.user_id = y.id order by regist_date desc limit 30';
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      // console.log('DEBUG -> rows : ', rows);
      res.json({"result": rows})
    }
    else {
      console.log('ERROR -> ', err);
    }
  });
});


// 정답 이력 최근 10개 가져오기
app.post('/api/getHistoryLog', cors(), function(req, res) {

  var sql = "select ifnull(y.username, 'PC') as username, ifnull(x.modify_date, '정답 미제출로 인한 pass') as modify_date, z.kanji, z.hiragana, z.hangul from tbl_japan_problem x left join tbl_user y on x.user_id = y.id join tbl_japan_store z on x.store_id = z.id where x.regist_date > DATE_FORMAT(date_sub(now(), interval 1 day),'%Y-%m-%d') order by x.regist_date desc limit 11";
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      // console.log('DEBUG -> rows : ', rows);
      res.json({"result": rows})
    }
    else {
      console.log('ERROR -> ', err);
    }
  });
});


// 현재 진행중인 한자 가져오기
app.post('/api/getCurrentKanji', cors(), function(req, res) {

  var sql = "select kanji from tbl_japan_problem x join tbl_japan_store y on x.store_id = y.id where x.regist_date > DATE_FORMAT(date_sub(now(), interval 1 day),'%Y-%m-%d') order by x.regist_date desc limit 1"
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      // console.log('DEBUG -> rows : ', rows);
      res.json({"result": rows})
    }
    else {
      console.log('ERROR -> ', err);
    }
  });
});


// 웹소켓 로직
io.on('connection', socket => {
  console.log('INFO -> connected');

  socket.on('chat', (content) => {
    user_id = '1';
    console.log('DEBUG -> content : ', content);
    console.log('DEBUG -> user_id : ', user_id);

    sql = "insert into tbl_chat (content, user_id) values('"+content+"', '"+user_id+"');"
    connection.query(sql, function(err, rows, fields) {
      if (err == null){
        io.sockets.emit('chat', content);
      } else {
        console.log('Error : ', err);
      }
    });
  })

  socket.on('kanji', (kanji) => {
    console.log('kanji -> ', kanji);
    io.sockets.emit('kanji', kanji);
  })

  socket.on('history', () => {
    console.log('INFO -> WS : called history');
    var sql = "select ifnull(y.username, 'PC') as username, ifnull(x.modify_date, '정답 미제출로 인한 pass') as modify_date, z.kanji, z.hiragana, z.hangul from tbl_japan_problem x left join tbl_user y on x.user_id = y.id join tbl_japan_store z on x.store_id = z.id where x.regist_date > DATE_FORMAT(now(),'%Y-%m-%d') order by x.regist_date desc limit 11";
    connection.query(sql, function(err, rows, fields) {
      if (err == null) {
        // console.log('DEBUG -> rows : ', rows);
        io.sockets.emit('history', rows);
      }
      else {
        console.log('ERROR -> ', err);
      }
    });
  })

  socket.on('disconnect', () => {
    console.log('INFO -> disconnected');
  })
})


server.listen(port, () => console.log(`Listening on port ${port}`))
