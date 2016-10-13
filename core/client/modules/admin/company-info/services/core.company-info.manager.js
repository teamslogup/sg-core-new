export default function companyInfoManager(CompanyInfo) {
    this.findCompanyInfo = findCompanyInfo;
    this.updateCompanyInfo = updateCompanyInfo;

    function updateCompanyInfo(companyInfo, callback) {
        var where = {};
        CompanyInfo.update(where, companyInfo, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findCompanyInfo(callback) {
        CompanyInfo.get({}, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }


}