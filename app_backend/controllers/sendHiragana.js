const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


// 정답 제출 시 호출되는 함수
exports.sendHiragana = function(req, res) {
    const connection = mysql.createConnection(dbconfig);
    const ioClient = ioc.connect(ioconfig);

    var content = req.body.content;
    var user_id = '1';

    console.log('DEBUG -> content : ', content);
    console.log('DEBUG -> user_id : ', user_id);

    res.json({"result": "1"})
}
