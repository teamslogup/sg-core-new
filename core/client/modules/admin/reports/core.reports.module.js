import reportsResources from './services/core.reports.constant';
import Report from './services/core.reports.model';
import reportsManager from './services/core.reports.manager';
import ReportsCtrl from './controllers/core.reports.controller';
import routes from './config/core.reports.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/reports/core.reports.scss'


export default angular.module("core.reports", [])
    .config(routes)
    .constant("reportsResources", reportsResources)
    .factory("Report", Report)
    .service("reportsManager", reportsManager)
    .controller("ReportsCtrl", ReportsCtrl)
    .name;