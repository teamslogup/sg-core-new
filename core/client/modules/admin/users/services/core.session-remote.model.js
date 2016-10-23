SessionRemote.$inject = ['$resource', 'usersResources'];

export default function SessionRemote($resource, usersResources) {
    return $resource(usersResources.SESSION_REMOTE + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        delete: {
            method: 'DELETE'
        },
        query: {
            isArray: false
        }
    });
}