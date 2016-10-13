Image.$inject = ['$resource', 'imagesResources'];

export default function Image($resource, imagesResources) {
    return $resource(imagesResources.IMAGES + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}