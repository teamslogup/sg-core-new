(function () {
    'use strict';

    angular
        .module('core.bbs')
        .service('viewsManager', viewsManager);

    /* @ngInject */
    function viewsManager(Views) {

        this.increaseViewCount = increaseViewCount;

        function increaseViewCount(slug, categoryId, articleId, callback) {
            var body = {
                slug: slug,
                categoryId: categoryId,
                articleId: articleId
            };

            Views.update({}, body, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data);
            });
        }
    }

})();