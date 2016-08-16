(function () {
    "use strict";

    angular.module('core.common').provider("staticLoader", staticLoader);

    /* @ngInject */
    function staticLoader() {
        var rootPath = "";
        var cacheMap = {};
        return {
            $get: function ($http) {
                var factory = {};
                factory.get = function (path, callback) {
                    if (rootPath) {
                        path = rootPath + path;
                    }
                    if (cacheMap[cacheMap]) {
                        return callback(200, cacheMap[cacheMap]);
                    }
                    $http.get(path).then(function (res) {
                        if (res.status == 200) {
                            cacheMap[path] = res.data;
                        }
                        callback(res.status, res.data);
                    });
                };
                return factory;
            },
            setRootPath: function (path) {
                rootPath = path;
            }
        };
    }

})();