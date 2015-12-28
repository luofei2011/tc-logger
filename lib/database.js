var mysql = require('mysql');

var connection = mysql.createConnection({
    socketPath: '/home/users/luofei02/.jumbo/var/run/mysqld/mysqld.sock',
    user: 'root',
    password: 'luofei',
    database: 'tcwise_logger',
    timezone: 'Asia/Shanghai'
});

connection.connect(function (err) {
    if (err) {
        console.log('mysql connection fail.');
    }
});

module.exports = connection;
