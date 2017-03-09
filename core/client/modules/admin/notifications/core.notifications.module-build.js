
import massNotificationsResources from './services/core.notifications.constant';
import MassNotification from './services/core.notification.model';
import MassNotificationCondition from './services/core.notification-condition.model';

import massNotificationsManager from './services/core.notifications.manager';
import massNotificationConditionManager from './services/core.notification-condition.manager';

import MassNotificationsCtrl from './controllers/core.notifications.controller';
import MassNotificationsCreateCtrl from './controllers/core.notifications-create.controller';
import massNotificationsCreate from './directives/notifications-create/core.notifications-create';

import routes from './config/core.notifications.route';
#{importCoreTheme}
#{importAppTheme}

export default angular.module("core.notifications", [])
    .config(routes)
    .constant('massNotificationsResources', massNotificationsResources)
    .factory('MassNotification', MassNotification)
    .factory('MassNotificationCondition', MassNotificationCondition)
    .service('massNotificationsManager', massNotificationsManager)
    .service('massNotificationConditionManager', massNotificationConditionManager)
    .controller('MassNotificationsCtrl', MassNotificationsCtrl)
    .controller('MassNotificationsCreateCtrl', MassNotificationsCreateCtrl)
    .directive("massNotificationsCreate", massNotificationsCreate)
    .name;