const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const port = 4000

const server = http.createServer(app)
const io = socketIO(server)

sample = [
  '愛想', '合間', '仰ぐ',
  '敢えて', '間柄', '諦め',
  '欺く', 'あざ笑う', '痣',
  '悪しからず', '褪せる'
]

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
