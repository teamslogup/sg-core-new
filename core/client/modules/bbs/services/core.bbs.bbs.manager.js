(function () {
    'use strict';

    angular
        .module('core.bbs')
        .service('bbsManager', bbsManager);

    /* @ngInject */
    function bbsManager(Bbs) {

        this.findBbs = findBbs;

        function findBbs(slug, categoryId, articleId, nick, title, last, size, callback) {
            Bbs.query({
                slug: slug,
                categoryId: categoryId,
                articleId: articleId,
                nick: nick,
                last: last,
                size: size,
                title: title
            }, function(data) {
                callback(200, data);
            }, function(data){
                callback(data.status);
            });
        }

        //function findArticle(slug, categoryId, articleId, callback) {
        //    Articles.get({
        //        slug: slug,
        //        categoryId: categoryId,
        //        articleId: articleId
        //    }, function(data) {
        //        callback(200, data);
        //    }, function(data){
        //        callback(data.status, data);
        //    });
        //}
        //
        //function removeArticleById(id, callback) {
        //
        //}
        //
        //function updateArticleById(article, callback) {
        //    var where = {articleId: article.id};
        //    delete article.id;
        //    Articles.update(where, article, function(data){
        //        callback(200, data);
        //    }, function(data) {
        //        callback(data.status, data);
        //    });
        //}
        //
        //function createArticle(article, callback) {
        //
        //}
    }

})();