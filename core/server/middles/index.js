module.exports.connect = function (config) {
    return function (req, res, next) {
        var middles = {
            s3: require('./s3')(config),
            session: require('./session')(),
            upload: require('./upload')(),
            validator: require('./validator')()
        };
        req.middles = middles;
        next();
    };
};