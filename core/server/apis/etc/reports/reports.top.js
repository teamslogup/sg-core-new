var top = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

top.hasAuthorization = function() {
    return function (req, res, next) {
        req.models.Report.findDataByAuthenticatedId(req.params.id, 'authorId', req.user.id, function(status, data) {
            if (status == 200) {
                req.report = data;
                next();
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = top;
