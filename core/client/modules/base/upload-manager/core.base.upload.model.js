Upload.$inject = ['$resource'];

export default function Upload ($resource) {
    return $resource('/api/etc/upload', {}, {});
}