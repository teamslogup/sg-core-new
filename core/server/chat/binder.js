var async = require('async');
var MiddlewareBinder = function(socket, io, payload) {

    var funcs = [];

    this.add = function(func) {
        funcs.push(function (n) {
            func(socket, io, payload, n);
        });
    };

    this.bind = function() {
        async.waterfall(funcs, function(err, socket, payload, n) {
            if (err) {
                return socket.emit('req_error', {
                    code: err.code
                });
            }
        });
    };
};

module.exports = MiddlewareBinder;