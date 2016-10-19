User.$inject = ['$resource', 'usersResources'];

export default function User($resource, usersResources) {
    return $resource(usersResources.USERS + '/:id', {
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