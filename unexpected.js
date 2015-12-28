var fs = require('fs');
var path = require('path');
var config = require('./conf');
var unexpected = require('./lib/errlog');
var connection = require('./lib/database');

fs.readdir(config.err_path, function (err, files) {
    if (err) return;
    files.length && files.forEach(function (file, index) {
        unexpected(path.join(config.err_path, file)).done(function (data) {
            data.length && data.forEach(function (item, idx) {
                connection.query('INSERT INTO unexpected SET ?', item, function (err, result) {
                    if (err) throw err;
                });
            });
        });
    });
});
