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
            //console.log('The solution is: ', rows);
        }
        else {
            //console.log('Error while performing Query.', err);
        }
    });
    res.json({"result":200})
}
