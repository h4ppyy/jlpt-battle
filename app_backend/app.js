// 모듈 관리
const express = require('express');
const http = require('http');
const async = require('async');
const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors')
const SQL = require('sql-template-strings')


// 사용자 모듈 관리
const common = require('./controllers/common.js');
const secret = require('./config/config.js').secret;


// express 서버 구성
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);


// socket.io 서버 구성
const io = socketIO(server);


// mysql connect 구성
const dbconfig   = require('./config/config.js').database;
const conn = mysql.createConnection(dbconfig);


// 미들웨어 관리
app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())


// router 관리
const urlsRouter = require('./routes/urls.js');
app.use('', urlsRouter);


var clientCount = 0;
// 웹소켓 로직
io.on('connection', socket => {
  common.logging_info('socketio', 'connection');
  clientCount += 1;
  io.sockets.emit('clientCount', clientCount);
  common.logging_info('clientCount', clientCount);


  // 웹소켓 (채팅)
  socket.on('chat', (payload) => {
      const token = payload.jwt
      const chat = payload.chat
      const now = Math.floor(Date.now() / 1000);
      common.logging_debug('token', token);
      common.logging_debug('chat', chat);

      async.waterfall([
          // 1. jwt 복호화
          function(callback) {
              jwt.verify(token, secret, function(err, decoded) {
                  if(err == null){
                      if(decoded.exp > now){
                          callback(null, decoded);
                      } else {
                          return false;
                      }
                  } else {
                      return false;
                  }
              });
          },
          // 2. 채팅 디비에 기록
          function(decoded, callback) {
              const id = decoded.id;
              const username = decoded.username;
              common.logging_debug('id', id);
              common.logging_debug('username', username);

              var sql = (SQL
                        `
                        insert into tbl_chat (content, user_id)
                        values(${chat}, ${id});
                        `
                        )
              common.logging_debug('sql', sql);
              conn.query(sql, function(err, rows, fields) {
                if (err == null){
                    callback(null, id, username)
                } else {
                    console.log('Error : ', err);
                    return false;
                }
              });
          },
          // 3. 채팅 디비에 기록한 PK 획득
          function(id, username, callback) {
              var sql = (SQL
                        `
                        select LAST_INSERT_ID() as chat_id
                        `
                        )
              common.logging_debug('sql', sql);
              conn.query(sql, function(err, rows, fields) {
                if (err == null){
                    const chat_id = rows[0].chat_id;
                    callback(null, id, username, chat_id)
                } else {
                    console.log('Error : ', err);
                    return false;
                }
              });
          },
          // 4. 채팅 등록일 획득
          function(id, username, chat_id, callback) {
              var sql = (SQL
                        `
                        select DATE_FORMAT(regist_date, "%Y-%m-%d %H:%i:%s") as regist_date
                        from tbl_chat
                        where id = ${chat_id};
                        `
                        )
              common.logging_debug('sql', sql);
              conn.query(sql, function(err, rows, fields) {
                if (err == null){
                    const regist_date = rows[0].regist_date;
                    callback(null, id, username, regist_date)
                } else {
                    console.log('Error : ', err);
                    return false;
                }
              });
          },
          // 5. 사용자 랭킹 획득
          function(id, username, regist_date, callback) {
              var sql = (SQL
                        `
                        select rank, jlpt_level, point
                        from (
                        select @curRank := @curRank + 1 AS rank,
                               x.id,
                               x.jlpt_level,
                               x.point
                        from tbl_user x, (SELECT @curRank := 0) r
                        order by point desc
                        ) t
                        where t.id = ${id}
                        `
                        )
              common.logging_debug('sql', sql);
              conn.query(sql, function(err, rows, fields) {
                if (err == null){
                    const ranking = rows[0].rank;
                    const point = rows[0].point;
                    const jlpt_level = rows[0].jlpt_level;
                    callback(null, id, username, regist_date, ranking, point, jlpt_level)
                } else {
                    console.log('Error : ', err);
                    return false;
                }
              });
          },
          // 5. 채팅 소켓 전송
          function(id, username, regist_date, ranking, point, jlpt_level, callback) {
              const data = {
                'username': username,
                'content': chat,
                'ranking': ranking,
                'point': point,
                'jlpt_level': jlpt_level,
                'regist_date': regist_date
              }
              io.sockets.emit('chat', data);
              return false;
          }
      ], function (err, result) {});
  })


  // 웹소켓 (한자 표기)
  socket.on('kanji_n1', (kanji) => {
      io.sockets.emit('kanji_n1', kanji);
  })
  socket.on('kanji_n2', (kanji) => {
      io.sockets.emit('kanji_n2', kanji);
  })
  socket.on('kanji_n3', (kanji) => {
      io.sockets.emit('kanji_n3', kanji);
  })
  socket.on('kanji_n4', (kanji) => {
      io.sockets.emit('kanji_n4', kanji);
  })
  socket.on('kanji_n5', (kanji) => {
      io.sockets.emit('kanji_n5', kanji);
  })
  socket.on('kanji_free', (kanji) => {
      io.sockets.emit('kanji_free', kanji);
  })


  // 히스토리 조회 쿼리 공통
  function makeHistorySql(level){
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
      return sql;
  }


  // 웹소켓 (이력 표기)
  socket.on('history_n1', () => {
    sql = makeHistorySql('n1')
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            io.sockets.emit('history_n1', rows);
            return false;
        }
        else {
            common.logging_error('err', err);
            return false;
        }
    });
  })
  socket.on('history_n2', () => {
    sql = makeHistorySql('n2')
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            io.sockets.emit('history_n2', rows);
            return false;
        }
        else {
            common.logging_error('err', err);
            return false;
        }
    });
  })
  socket.on('history_n3', () => {
    sql = makeHistorySql('n3')
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            io.sockets.emit('history_n3', rows);
            return false;
        }
        else {
            common.logging_error('err', err);
            return false;
        }
    });
  })
  socket.on('history_n4', () => {
    sql = makeHistorySql('n4')
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            io.sockets.emit('history_n4', rows);
            return false;
        }
        else {
            common.logging_error('err', err);
            return false;
        }
    });
  })
  socket.on('history_n5', () => {
    sql = makeHistorySql('n5')
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            io.sockets.emit('history_n5', rows);
            return false;
        }
        else {
            common.logging_error('err', err);
            return false;
        }
    });
  })
  socket.on('history_free', () => {
    sql = makeHistorySql('free')
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            io.sockets.emit('history_free', rows);
            return false;
        }
        else {
            common.logging_error('err', err);
            return false;
        }
    });
  })


  // 웹소켓 (커넥션 끊기)
  socket.on('end', function (){
      socket.disconnect(0);
  });


  // 웹소켓 (끊김 알림)
  socket.on('disconnect', () => {
      common.logging_info('socketio', 'disconnected');
      clientCount -= 1;
      io.sockets.emit('clientCount', clientCount);
      common.logging_info('clientCount', clientCount);
  })
})


// 서버 실행 시 포트 표기
server.listen(port, () => console.log(`Listening on port ${port}`))
