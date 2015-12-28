var readfile = require('./readfile');
var sysConfig = require('../conf');
var path = require('path');
var Q = require('q');

var errReg = /^(\w+Error):\s*(.*)$/;
var weekReg = /^[Mon|Tue|Wed|Thu|Fri|Sat|Sun][^\)]+\)/;

function getJSONFromFile(filename, config) {
    var deferred = Q.defer();
    readfile(filename, config).done(function (data) {
        var lines = data.split('\n');
        var len = lines.length;
        var i = 0;
        var ret = [];

        for (; i < len; i++) {
            var item = lines[i];
            var matches = item.match(errReg);
            var prefix;
            var surfix;
            var time;
            var file;
            if (matches) {
                prefix = getErrPrefix(i, lines);
                surfix = getErrSurfix(i, lines);
                time = getErrTime(surfix + 1, lines);
                // 没有找到具体的错误文件或者行数
                if (prefix === i) {
                    file = {file: '', nu: 0, offset: 0};
                }
                else {
                    file = getErrFileAndNu(lines[prefix]);
                }
                ret.push({
                    occur_time: new Date(time),
                    idc: '',
                    host: path.basename(filename, sysConfig.log_ext),
                    file: file.file,
                    line: file.nu,
                    offset: file.offset,
                    error: matches[0],
                    description: lines.slice(prefix, surfix + 1).join('\n')
                });

                // 更新迭代指针
                i = surfix + 2;
            }
        }

        deferred.resolve(ret);
    });

    return deferred.promise;
}

function getErrPrefix(nowIdx, lines) {
    while ((lines[--nowIdx] || '').trim()) {}
    return (++nowIdx || 0);
}

function getErrSurfix(nowIdx, lines) {
    while (/^\s*at\s*/.test((lines[++nowIdx] || ''))) {}
    return (--nowIdx || 0);
}

function getErrTime(index, lines) {
    var matches = lines[index].match(weekReg);
    return matches && matches[0] || null;
}

function getErrFileAndNu(str) {
    var arr = str.split(/\s*:\s*/);
    return {
        file: arr[0] || '',
        nu: arr[1] || 0,
        offset: arr[2] || 0
    };
}

module.exports = getJSONFromFile;
