import noticesResources from './services/core.notices.constant';
import Notice from './services/core.notices.model';
import noticesManager from './services/core.notices.manager';
import NoticesCtrl from './controllers/core.notices.controller';

export default angular.module("core.notices", [])
    .constant("noticesResources", noticesResources)
    .factory("Notice", Notice)
    .service("noticesManager", noticesManager)
    .controller("NoticesCtrl", NoticesCtrl)
    .name;