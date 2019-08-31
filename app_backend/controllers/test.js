const async = require('async');
const mysql = require('mysql');
const ioc = require("socket.io-client");

const dbconfig   = require('../config/database.js');
const ioconfig   = require('../config/ioClient.js');
const common = require('./common.js');

const connection = mysql.createConnection(dbconfig);


exports.test = function(req, res) {
    const ioClient = ioc.connect(ioconfig);

    connection.query('select * from tbl_user', function(err, rows, fields) {
        if (err == null) {
            console.log('The solution is: ', rows);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
    res.json({"result":200})
}
