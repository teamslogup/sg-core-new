var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.logout = function(){
    return function(req, res, next){
        req.logout();
        return res.hjson(req, next, 204);
    };
};

module.exports = del;
