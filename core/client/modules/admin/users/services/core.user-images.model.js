UserImages.$inject = ['$resource', 'userImagesResources'];

export default function UserImages($resource, userImagesResources) {
    return $resource(userImagesResources.USER_IMAGES + '/:id', {
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