export default function dashboardInfoManager(DashboardInfo) {
    "ngInject";

    this.findDashboardInfo = findDashboardInfo;

    function findDashboardInfo(data, callback) {

        var query = {
            year: data.year || '',
            months: data.months || ''
        };

        DashboardInfo.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }


}