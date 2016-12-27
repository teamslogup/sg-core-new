Image.$inject = ['$resource', 'coreBaseUploadResources'];

export default function Image ($resource, coreBaseUploadResource) {
    return $resource(coreBaseUploadResource.IMAGES + '/:id', {
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