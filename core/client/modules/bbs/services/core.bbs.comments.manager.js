(function () {
    'use strict';

    angular
        .module('core.bbs')
        .service('commentsManager', commentsManager);

    /* @ngInject */
    function commentsManager(Comments, $q) {

        this.removeComment = removeComment;
        this.findAllComments = findAllComments;
        this.findBoardBySlug = findBoardBySlug;
        this.createComment = createComment;

        function createComment(commentBody, callback) {
            var comment = new Comments(commentBody);
            comment.$save(function(data){
                callback(201, data);
            }, function(data) {
                callback(data.status, data.data);
            });
        }

        function findAllComments(where, callback) {
            Comments.query(where, function(data){
                callback(200, data);
            }, function(data) {
                callback(data.status, data);
            });
        }

        function removeComment(comment, callback) {
            comment = new Comments(comment);
            comment.$remove(function(data) {
                callback(204);
            });
        }

        function findBoardBySlug(slug, callback) {
            Comments.get({
                slug: slug
            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status);
            });
        }
    }

})();