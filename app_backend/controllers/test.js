const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


exports.test = function(req, res) {
    console.log('req.decoded -> ', req.decoded);

    const conn = mysql.createConnection(dbconfig);

    var sql = ""
    common.logging_debug('sql', sql);
    conn.query(sql, function(err, rows, fields) {
        if (err == null) {
            common.logging_debug('rows', rows);
            res.json({"result":200})
            conn.end()
            return false;
        }
        else {
            common.logging_error('err', err);
            conn.end()
            return false;
        }
    });
}
