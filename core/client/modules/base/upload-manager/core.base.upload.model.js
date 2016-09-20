Upload.$inject = ['$resource', 'coreBaseUploadResources'];

export default function Upload ($resource, coreBaseUploadResources) {
    return $resource(coreBaseUploadResources.UPLOAD, {}, {});
}