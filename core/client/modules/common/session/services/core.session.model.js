Session.$inject = ['$resource', 'sessionResources'];

export default function Session($resource, sessionResources) {
    return $resource(sessionResources.SESSION, {}, {
        update: {
            method: 'PUT'
        }
    });
}