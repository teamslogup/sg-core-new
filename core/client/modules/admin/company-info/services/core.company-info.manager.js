export default function companyInfoManager(CompanyInfo, metaManager, loadingHandler) {

    var LOADING = metaManager.std.loading;
    var MAGIC = metaManager.std.magic;

    this.findCompanyInfo = findCompanyInfo;
    this.updateCompanyInfo = updateCompanyInfo;

    function updateCompanyInfo(companyInfo, callback) {

        if (isValidateCompanyInfo(companyInfo)) {

            var where = {};

            var body = {
                companyName: companyInfo.companyName,
                representative: companyInfo.representative,
                regNum: companyInfo.regNum,
                privateInfoManager: companyInfo.privateInfoManager,
                address: companyInfo.address,
                contact: companyInfo.contact || MAGIC.reset
            };

            loadingHandler.startLoading(LOADING.spinnerKey, 'updateCompanyInfo');
            CompanyInfo.update(where, body, function (data) {
                callback(200, data);
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateCompanyInfo');
            }, function (data) {
                callback(data.status, data.data);
                loadingHandler.endLoading(LOADING.spinnerKey, 'updateCompanyInfo');
            });
        } else {
            callback(400, {
                code: "400_53"
            });
        }

    }

    function findCompanyInfo(callback) {
        CompanyInfo.get({}, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function isValidateCompanyInfo(companyInfo) {

        if (!companyInfo.companyName) {
            return false;
        }

        if (!companyInfo.representative) {
            return false;
        }

        if (!companyInfo.regNum) {
            return false;
        }

        if (!companyInfo.privateInfoManager) {
            return false;
        }

        if (!companyInfo.address) {
            return false;
        }

        return true;
    }


}