(function () {
    'use strict';

    angular
        .module('core.users')
        .service('usersManager', usersManager);

    /* @ngInject */
    function usersManager(Users) {

        this.findAllUsers = findAllUsers;
        this.findUserById = findUserById;
        this.updateUserById = updateUserById;
        this.signup = signup;

        function updateUserById(user, callback) {
            var where = {id: user.id};
            delete user.id;
            Users.update(where, user, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data);
            });
        }

        function findUserById(id, callback) {
            Users.get({
                id: id
            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status);
            });
        }

        function findAllUsers(callback) {
            Users.query({

            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status);
            });
        }

        function signup(body, callback) {
            var user = new Users(body);
            user.$save(function (data) {
                callback(201, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        }
    }

})();