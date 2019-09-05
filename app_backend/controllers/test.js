const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/config.js').database;
const ioconfig   = require('../config/config.js').socketio;
const common = require('./common.js');


exports.test = function(req, res) {
    console.log('req.decoded -> ', req.decoded);
    const connection = mysql.createConnection(dbconfig);
    // const ioClient = ioc.connect(ioconfig);

    connection.query('select * from tbl_user', function(err, rows, fields) {
        if (err == null) {
            common.logging_debug('rows', rows);
        }
        else {
            common.logging_error('err', err);
        }
    });
    res.json({"result":200})
    connection.end()
    return false;
}
