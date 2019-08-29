const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socketIO(server);

const ioc = require("socket.io-client");
const ioClient = ioc.connect("http://localhost:4000");

const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);


// cors all allow
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


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


// 채팅 내역 최근 30개 가져오기
app.get('/api/getChatLog', function(req, res) {

  var sql = 'select y.username, x.content, x.regist_date from tbl_chat x join tbl_user y on x.user_id = y.id order by regist_date desc limit 30';
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      console.log('DEBUG -> rows : ', rows);
      res.json({"result": rows})
    }
    else {
      console.log('ERROR -> ', err);
    }
  });
});


// 정답 이력 최근 10개 가져오기
app.get('/api/getHistoryLog', function(req, res) {

  var sql = "select ifnull(y.username, 'PC') as username, ifnull(x.modify_date, '정답 미제출로 인한 pass') as modify_date, z.kanji, z.hiragana, z.hangul from tbl_japan_problem x left join tbl_user y on x.user_id = y.id join tbl_japan_store z on x.store_id = z.id where x.regist_date > DATE_FORMAT(now(),'%Y-%m-%d') order by x.regist_date desc limit 11";
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      console.log('DEBUG -> rows : ', rows);
      res.json({"result": rows})
    }
    else {
      console.log('ERROR -> ', err);
    }
  });
});


// 현재 진행중인 한자 가져오기
app.get('/api/getCurrentKanji', function(req, res) {

  var sql = "select kanji from tbl_japan_problem x join tbl_japan_store y on x.store_id = y.id where x.regist_date > DATE_FORMAT(now(),'%Y-%m-%d') order by x.regist_date desc limit 1"
  connection.query(sql, function(err, rows, fields) {
    if (err == null) {
      console.log('DEBUG -> rows : ', rows);
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

  socket.on('disconnect', () => {
    console.log('INFO -> disconnected');
  })
})


server.listen(port, () => console.log(`Listening on port ${port}`))
