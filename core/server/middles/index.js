module.exports.connect = function (config) {
    return function (req, res, next) {
        var middles = {
            s3: require('./s3')(config),
            session: require('./session')(),
            upload: require('./upload')(),
            notification: require('./notification')(),
            validator: require('./validator')(),
            role: require('./role')(),
            terms: require('./terms')()
        };
        req.middles = middles;
        next();
    };
};