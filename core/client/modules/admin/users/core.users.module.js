import usersResources from './services/core.users.constant';
import User from './services/core.users.model';
import UserImages from './services/core.user-images.model';
import Notification from './services/core.notification.model';
import NotificationBox from './services/core.notification-box.model';
import NotificationSwitch from './services/core.notification-switch.model';
import SessionRemote from './services/core.session-remote.model';
import AdminUser from './services/core.admin-users.model';
import Profile from './services/core.profile.model';
import usersManager from './services/core.users.manager';
import notificationManager from './services/core.notification.manager';
import notificationBoxManager from './services/core.notification-box.manager';
import notificationSwitchManager from './services/core.notification-switch.manager';
import sessionRemoteManager from './services/core.session-remote.manager';
import profileManager from './services/core.profile.manager';
import UsersCtrl from './controllers/core.users.controller';

export default angular.module("core.users", [])
    .constant("usersResources", usersResources)
    .factory("User", User)
    .factory("UserImages", UserImages)
    .factory("Notification", Notification)
    .factory("NotificationBox", NotificationBox)
    .factory("NotificationSwitch", NotificationSwitch)
    .factory("SessionRemote", SessionRemote)
    .factory("AdminUser", AdminUser)
    .factory("Profile", Profile)
    .service("usersManager", usersManager)
    .service("notificationManager", notificationManager)
    .service("notificationBoxManager", notificationBoxManager)
    .service("notificationSwitchManager", notificationSwitchManager)
    .service("sessionRemoteManager", sessionRemoteManager)
    .service("profileManager", profileManager)
    .controller("UsersCtrl", UsersCtrl)
    .name;