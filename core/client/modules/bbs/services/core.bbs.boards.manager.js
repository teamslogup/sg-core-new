(function () {
    'use strict';

    angular
        .module('core.bbs')
        .service('boardsManager', boardsManager);

    /* @ngInject */
    function boardsManager(Boards, $q) {

        this.boards = [];
        this.removeBoardBySlug = removeBoardBySlug;
        this.updateBoardBySlug = updateBoardBySlug;
        this.findAllBoards = findAllBoards;
        this.findBoardBySlug = findBoardBySlug;
        this.createBoard = createBoard;

        function updateBoardBySlug(slug, callback) {
            callback(200);
        }

        function createBoard() {
            var deferred = $q.defer();
            deferred.resolve();
            //deferred.reject();
        }

        function removeBoardBySlug(slug) {
            var deferred = $q.defer();
            deferred.resolve();
            //deferred.reject();
        }

        function findBoardBySlug(slug, callback) {
            Boards.get({
                slug: slug
            }, function (data) {
                callback(200, data);
            }, function (data) {
                callback(data.status);
            });
        }

        function findAllBoards() {
            var deferred = $q.defer();
            deferred.resolve();
            //deferred.reject();
        }
    }

})();