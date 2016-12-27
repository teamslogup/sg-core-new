SocialSession.$inject = ['$resource', 'sessionResources'];

export default function SocialSession($resource, sessionResources) {
    return $resource(sessionResources.SOCIAL_SESSION, {}, {});
}