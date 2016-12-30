import MassNotificationsCtrl from './controllers/core.mass-notifications.controller';
import routes from './config/core.mass-notifications.route';
import '../../../../../core/client/assets/themes/admin/cloudy/stylesheets/modules/mass-notifications/core.mass-notifications.scss'


export default angular.module("core.mass-notifications", [])
    .config(routes)
    .controller('MassNotificationsCtrl', MassNotificationsCtrl)
    .name;