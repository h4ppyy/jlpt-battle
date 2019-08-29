const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socketIO(server);

var dbconfig   = require('./config/database.js');
var connection = mysql.createConnection(dbconfig);

sample = [
  '愛想', '合間', '仰ぐ',
  '敢えて', '間柄', '諦め',
  '欺く', 'あざ笑う', '痣',
  '悪しからず', '褪せる'
]

app.get('/', function(req, res) {

  connection.query('select * from tbl_user', function(err, rows, fields) {
    if (!err)
      console.log('The solution is: ', rows);
    else
      console.log('Error while performing Query.', err);
  });

  res.json({"result":200})
});

io.on('connection', socket => {
  console.log('INFO -> connected');

  socket.on('chat', (content) => {
    console.log('chat -> ', content);
    io.sockets.emit('chat', content);
  })

  socket.on('kanji', (kanji) => {
    console.log('kanji -> ', sample[kanji]);
    io.sockets.emit('kanji', sample[kanji]);
  })

  socket.on('disconnect', () => {
    console.log('INFO -> disconnected');
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
