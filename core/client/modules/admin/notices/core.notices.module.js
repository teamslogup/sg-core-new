import noticesResources from './services/core.notices.constant';
import Notice from './services/core.notices.model';
import noticesManager from './services/core.notices.manager';
import NoticesCtrl from './controllers/core.notices.controller';
import routes from './config/core.notices.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/notices/core.notices.scss'


export default angular.module("core.notices", [])
    .config(routes)
    .constant("noticesResources", noticesResources)
    .factory("Notice", Notice)
    .service("noticesManager", noticesManager)
    .controller("NoticesCtrl", NoticesCtrl)
    .name;