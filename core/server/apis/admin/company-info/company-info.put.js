var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var COMPANY_INFO = req.meta.std.companyInfo;

        req.check('companyName', '400_8').len(COMPANY_INFO.minCompanyNameLength, COMPANY_INFO.maxCompanyNameLength);
        req.check('representative', '400_8').len(COMPANY_INFO.minRepresentativeLength, COMPANY_INFO.maxRepresentativeLength);
        req.check('regNum', '400_8').len(COMPANY_INFO.minRegNumLength, COMPANY_INFO.maxRegNumLength);
        req.check('privateInfoManager', '400_8').len(COMPANY_INFO.minPrivateInfoManagerLength, COMPANY_INFO.maxPrivateInfoManagerLength);
        req.check('address', '400_8').len(COMPANY_INFO.minAddressLength, COMPANY_INFO.maxAddressLength);

        req.utils.common.checkError(req, res, next);
        next();
    };
};

put.setParam = function () {
    return function (req, res, next) {

        var body = req.body;
        body.id = 1;

        req.models.CompanyInfo.upsertData(req.body, {
            where: {
                id: 1
            }
        }, function (status, data) {

            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }

        });

    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;