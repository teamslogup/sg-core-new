(function () {
    'use strict';

    angular
        .module('core.bbs')
        .service('articlesManager', articlesManager);

    /* @ngInject */
    function articlesManager(Articles) {

        this.articles = [];

        this.findAllArticles = findAllArticles;
        this.findArticle = findArticle;
        this.removeArticle = removeArticle;
        this.updateArticleById = updateArticleById;
        this.createArticle = createArticle;

        function findAllArticles(slug, categoryId, authorId, last, nick, title, callback) {
            Articles.query({
                slug: slug,
                categoryId: categoryId,
                authorId: authorId,
                nick: nick,
                last: last,
                title: title
            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status);
            });
        }

        function findArticle(slug, categoryId, articleId, callback) {
            Articles.get({
                slug: slug,
                categoryId: categoryId,
                articleId: articleId
            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data);
            });
        }

        function removeArticle(article, callback) {
            article = new Articles(article);
            article.$remove(function (data) {
                callback(204);
            });
        }

        function updateArticleById(article, callback) {
            var where = {id: article.id};
            delete article.id;
            Articles.update(where, article, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status, data);
            });
        }

        function createArticle(articleBody, callback) {
            var article = new Articles(articleBody);
            article.$save(function (data) {
                callback(201, data);
            }, function (data) {
                callback(data.status, data.data);
            });
        }
    }

})();