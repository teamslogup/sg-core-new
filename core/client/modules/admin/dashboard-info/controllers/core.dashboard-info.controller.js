export default function DashboardInfoCtrl($scope, $filter, dashboardInfoManager, dialogHandler, loadingHandler, metaManager) {
    var vm = null;
    if ($scope.vm !== undefined) {
        vm = $scope.vm;
    } else {
        vm = $scope.vm = {};
    }

    var LOADING = metaManager.std.loading;

    $scope.dashboardInfo = undefined;

    $scope.findDashboardInfo = function () {
        loadingHandler.startLoading(LOADING.spinnerKey, 'findDashboardInfo');
        dashboardInfoManager.findDashboardInfo(getParams(), function (status, data) {
            if (status == 200) {
                $scope.dashboardInfo = data;
                setUserChart();
                setReportChart();
            } else {
                dialogHandler.alertError(status, data);
            }

            loadingHandler.endLoading(LOADING.spinnerKey, 'findDashboardInfo');
        });
    };

    $scope.findDashboardInfo();

    function getParams() {
        var today = new Date();

        var month = today.getMonth() + 1;
        var months = [];

        for (var i = 0; i < 5; i++) {

            var temp = month - i;
            if (month - i <= 0) {
                temp += 12;
            }
            months.push(temp);
        }

        var params = {
            year: today.getFullYear(),
            months: months.join(',')
        };

        return params;
    }

    function setUserChart() {
        var usersStatusByMonth = $scope.dashboardInfo.usersStatusByMonth;
        var createdUsers = usersStatusByMonth.createdUsers;
        var deletedUsers = usersStatusByMonth.deletedUsers;

        var labels = [];
        var data = [[], []];

        var today = new Date();
        var currentMonth = today.getMonth() + 1;

        for (var i = 0; i < 5; i++) {

            if (currentMonth == 0) {
                currentMonth += 12;
            }

            labels.unshift(currentMonth + $filter('translate')('month'));

            var createdUsersNotMatched = true;
            for (var j = 0; j < createdUsers.length; j++) {
                if (createdUsers[j].month == currentMonth) {
                    data[0].unshift(createdUsers[j].count);
                    createdUsersNotMatched = false;
                }
            }

            if (createdUsersNotMatched) {
                data[0].unshift(0);
            }

            var deletedUsersNotMatched = true;
            for (var k = 0; k < deletedUsers.length; k++) {
                if (deletedUsers[k].month == currentMonth) {
                    data[1].unshift(deletedUsers[k].count);
                    deletedUsersNotMatched = false;
                }
            }

            if (deletedUsersNotMatched) {
                data[1].unshift(0);
            }

            currentMonth--;
        }

        $scope.userChart.labels = labels;
        $scope.userChart.data = data;
    };

    function setReportChart() {
        var reportsStatusByMonth = $scope.dashboardInfo.reportsStatusByMonth;
        var createdReports = reportsStatusByMonth.createdReports;
        var deletedReports = reportsStatusByMonth.deletedReports;

        var labels = [];
        var data = [[], []];

        var today = new Date();
        var currentMonth = today.getMonth() + 1;

        for (var i = 0; i < 5; i++) {

            if (currentMonth == 0) {
                currentMonth += 12;
            }

            labels.unshift(currentMonth + $filter('translate')('month'));

            var createdReportsNotMatched = true;
            for (var j = 0; j < createdReports.length; j++) {
                if (createdReports[j].month == currentMonth) {
                    data[0].unshift(createdReports[j].count);
                    createdReportsNotMatched = false;
                }
            }

            if (createdReportsNotMatched) {
                data[0].unshift(0);
            }

            var deletedReportsNotMatched = true;
            for (var k = 0; k < deletedReports.length; k++) {
                if (deletedReports[k].month == currentMonth) {
                    data[1].unshift(deletedReports[k].count);
                    deletedReportsNotMatched = false;
                }
            }

            if (deletedReportsNotMatched) {
                data[1].unshift(0);
            }

            currentMonth--;
        }

        $scope.reportChart.labels = labels;
        $scope.reportChart.data = data;
    }

    $scope.loginChart = {
        labels: ["5월", "6월", "7월", "8월", "9월", "10월", "11월"],
        series: ['로그인수', '회원수'],
        data: [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ],
        onClick: function (points, evt) {
            console.log(points, evt);
        },
        datasetOverride: [{yAxisID: 'y-axis-1'}],
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        },
        colors: ["#6d8fe4", "#dcdcdc"]
    };

    $scope.userAgeChart = {
        labels: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
        data: [65, 59, 80, 81, 56, 55],
        colors: ["#dae1f1", "#6d8fe4", "#62bbdb", "#6be1cf", "#b4ff91", "#f6ff6d"]
    };

    $scope.userChart = {
        labels: ["5월", "6월", "7월", "8월", "9월", "10월", "11월"],
        series: ['가입자', '탈퇴자'],
        data: [
            // [65, 59, 80, 81, 56, 55, 40],
            // [28, 48, 40, 19, 86, 27, 90]
        ],
        onClick: function (points, evt) {
            console.log(points, evt);
        },
        datasetOverride: [{yAxisID: 'y-axis-1'}],
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        },
        colors: ["#dcdcdc;",
            "#ff8f8f;"]
    };


    $scope.reportChart = {
        labels: ["5월", "6월", "7월", "8월", "9월", "10월", "11월"],
        series: ['문의수', '답변수'],
        data: [
            // [80, 60, 80, 81, 40, 30, 66],
            // [55, 58, 40, 50, 45, 22, 48]
        ],
        datasetOverride: [{yAxisID: 'y-axis-1'}],
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                ]
            }
        },
        colors: ["#dcdcdc;",
            "#41b1a0;"]
    };

}