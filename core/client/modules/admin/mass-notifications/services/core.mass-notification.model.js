MassNotification.$inject = ['$resource', 'massNotificationsResources'];

export default function MassNotification($resource, massNotificationsResources) {
    return $resource(massNotificationsResources.MASS_NOTIFICATIONS + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}