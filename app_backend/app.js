// 모듈 관리
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors')

// express 서버 구성
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);


// socket.io 서버 구성
const io = socketIO(server);


// mysql connect 구성
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);


// 미들웨어 관리
app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())


// router 관리
const urlsRouter = require('./routes/urls.js');
app.use('', urlsRouter);


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


// 서버 실행 시 포트 표기
server.listen(port, () => console.log(`Listening on port ${port}`))
