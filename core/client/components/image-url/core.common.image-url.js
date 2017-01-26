export default function imageUrl (metaManager) {
    "ngInject";

    return function (image, prefix) {
        if (image && image.authorized) {
            var imageName = image.name;
            if (prefix) {
                imageName = prefix + '_' + imageName;
            }
            if (metaManager.std.flag.isUseS3Bucket) {
                return metaManager.std.cdn.rootUrl + '/' + metaManager.std.file.folderImages + '/' + image.folder + '/' + image.dateFolder + '/' + imageName;
            } else {
                return '/' + metaManager.std.file.folderImages + '/' + image.folder + '/' + image.dateFolder + '/' + imageName;
            }
        } else {
            return null;
        }
    }
}