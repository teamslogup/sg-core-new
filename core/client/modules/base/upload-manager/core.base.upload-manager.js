export default function uploadManager(fileUploader, Upload) {
    this.uploadImage = uploadImage;
    this.deleteImage = deleteImage;

    function uploadImage(files, folder, callback) {
        fileUploader.upload('file', {
            folder: folder
        }, files, '/api/etc/image').then(function(data) {
            callback(201, data.data.list[0]);
        }).catch(function(err) {
            //console.log(err.status, err.data);
            callback(err.status, err.data)
        });
    }

    function deleteImage(upload, callback) {
        console.log(upload);
        upload = new Upload(upload);
        upload.$remove(function(data) {
            callback(200, data);
        }, function(data) {
            callback(data.status, data.data);
        });
    }
}