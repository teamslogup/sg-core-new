import UsersResources from './services/core.users.constant';
import User from './services/core.users.model';
import usersManager from './services/core.users.manager';

export default angular.module("core.users", [])
    .constant("UsersResources", UsersResources)
    .factory("User", User)
    .service("usersManager", usersManager)
    .name;