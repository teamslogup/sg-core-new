Pass.$inject = ['$resource', 'sessionResources'];

export default function Pass($resource, sessionResources) {
    return $resource(sessionResources.PASS, {}, {
        update: {
            method: 'PUT'
        }
    });
}