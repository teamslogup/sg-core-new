import MassNotificationsCtrl from './controllers/core.mass-notifications.controller';
import routes from './config/core.mass-notifications.route';
#{importCoreTheme}
#{importAppTheme}

export default angular.module("core.mass-notifications", [])
    .config(routes)
    .controller('MassNotificationsCtrl', MassNotificationsCtrl)
    .name;