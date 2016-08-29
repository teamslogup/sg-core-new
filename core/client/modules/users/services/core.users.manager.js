export default function usersManager(User) {
    this.findAllUsers = findAllUsers;
    this.findUserById = findUserById;
    this.updateUserById = updateUserById;
    this.signup = signup;

    function updateUserById(user, callback) {
        var where = {id: user.id};
        delete user.id;
        User.update(where, user, function (data) {
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

    function findAllUsers(searchItem, option, last, size, order, sorted, callback) {
        User.query({
            searchItem: searchItem || '',
            option: option || '',
            last: last || '',
            size: size || '',
            order: order || '',
            sorted: sorted || ''
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
}