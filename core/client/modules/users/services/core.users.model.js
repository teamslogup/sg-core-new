User.$inject = ['$resource', 'UsersResources'];

export default function User($resource, UsersResources) {
    return $resource(UsersResources.USERS + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: true
        }
    });
}