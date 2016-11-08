export default function usersManager(User, AdminUser) {
    this.findAllUsers = findAllUsers;
    this.findUserById = findUserById;
    this.updateUserById = updateUserById;
    this.signup = signup;
    this.deleteUser = deleteUser;

    function updateUserById(id, data, callback) {
        var where = {id: id};
        User.update(where, data, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function findUserById(id, callback) {
        User.get({
            id: id
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status);
        });
    }

    function findAllUsers(data, callback) {
        AdminUser.query({
            searchItem: data.searchItem || '',
            searchField: data.searchField || '',
            last: data.last || '',
            size: data.size || '',
            order: data.order || '',
            sorted: data.sorted || ''
        }, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function signup(body, callback) {
        var user = new User(body);
        user.$save(function (data) {
            callback(201, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }

    function deleteUser(user, callback) {
        user = new User(user);
        user.$remove(function (data, status) {
            console.log(status, data);
            callback(204, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}