import dashboardInfoResources from './services/core.dashboard-info.constant';
import DashboardInfo from './services/core.dashboard-info.model';
import dashboardInfoManager from './services/core.dashboard-info.manager';
import DashboardInfoCtrl from './controllers/core.dashboard-info.controller';

export default angular.module("core.dashboard-info", [])
    .constant("dashboardInfoResources", dashboardInfoResources)
    .factory("DashboardInfo", DashboardInfo)
    .service("dashboardInfoManager", dashboardInfoManager)
    .controller("DashboardInfoCtrl", DashboardInfoCtrl)
    .name;