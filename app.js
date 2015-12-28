var express = require('express');
var path = require('path');
var connection = require('./lib/database');
var Q = require('q');

var app = express();

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/unexpected/getall', function (req, res) {
    getData().done(function (results) {
        res.render('unexpected', {items: results});
        connection.destroy();
    });
});

app.get('/unexpected/recent', function (req, res) {
    res.end(JSON.stringify(req.query));
});

app.listen(8503);

function getData() {
    var deferred = Q.defer();
    connection.query('SELECT * FROM unexpected', function (err, results, fields) {
        if (err) {
            deferred.reject();
            return;
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}
