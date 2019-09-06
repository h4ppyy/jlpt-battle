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
