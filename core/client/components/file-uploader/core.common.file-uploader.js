export default function fileUploader ($http) {
    this.upload = function (prefix, data, files, uploadUrl) {
        var i = 0;
        var fd = new FormData();
        for (var k in files) fd.append(prefix + i++, files[k]);
        for (var k in data) fd.append(k, data[k]);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };
}