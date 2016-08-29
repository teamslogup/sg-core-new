Pass.$inject = ['$resource'];

export default function Pass($resource, sessionResources) {
    return $resource(sessionResources.PASS, {}, {
        update: {
            method: 'PUT'
        }
    });
}