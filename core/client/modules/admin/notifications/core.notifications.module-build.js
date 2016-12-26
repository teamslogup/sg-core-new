import NotificationsCtrl from './controllers/core.notifications.controller';
import routes from './config/core.notifications.route';
#{importCoreTheme}
#{importAppTheme}

export default angular.module("core.notifications", [])
    .config(routes)
    .controller('NotificationsCtrl', NotificationsCtrl)
    .name;