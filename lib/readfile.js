var fs = require('fs');
var Q = require('q');
var extend = require('node.extend');

function fileGetContent(filename, config) {
    var deferred = Q.defer();
    config = extend({
        encoding: 'utf8',
        flag: 'r'
    }, config);

    fs.readFile(filename, config, function (err, data) {
        if (err) {
            deferred.reject();
            return;
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}

module.exports = fileGetContent;
