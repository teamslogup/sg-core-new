import NotificationsCtrl from './controllers/core.notifications.controller';
import routes from './config/core.notifications.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/notifications/core.notifications.scss'


export default angular.module("core.notifications", [])
    .config(routes)
    .controller('NotificationsCtrl', NotificationsCtrl)
    .name;