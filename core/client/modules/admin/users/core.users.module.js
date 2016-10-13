import usersResources from './services/core.users.constant';
import User from './services/core.users.model';
import AdminUser from './services/core.admin-users.model';
import usersManager from './services/core.users.manager';
import UsersCtrl from './controllers/core.users.controller';

export default angular.module("core.users", [])
    .constant("usersResources", usersResources)
    .factory("User", User)
    .factory("AdminUser", AdminUser)
    .service("usersManager", usersManager)
    .controller("UsersCtrl", UsersCtrl)
    .name;