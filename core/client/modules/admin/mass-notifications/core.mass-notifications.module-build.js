import routes from './config/core.mass-notifications.route';
import MassNotificationsCtrl from './controllers/core.mass-notifications.controller';
#{importCoreTheme}
#{importAppTheme}

export default angular.module("core.mass-notifications", [])
    .config(routes)
    .controller('MassNotificationsCtrl', MassNotificationsCtrl)
    .name;