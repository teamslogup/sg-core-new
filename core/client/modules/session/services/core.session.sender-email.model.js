SenderEmail.$inject = ['$resource'];

export default function SenderEmail($resource, sessionResources) {
    return $resource(sessionResources.SENDER_EMAIL, {}, {});
}