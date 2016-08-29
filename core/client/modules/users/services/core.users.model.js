User.$inject = ['$resource'];

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