Profile.$inject = ['$resource', 'usersResources'];

export default function Profile($resource, usersResources) {
    return $resource(usersResources.PROFILE + '/:id', {
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