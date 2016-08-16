(function () {
    'use strict';

    angular.module("core.bbs").controller("BbsCtrl", BbsCtrl);

    /* @ngInject */
    function BbsCtrl($scope, $location, $stateParams, $css, bbsUtils, metaManager, bbsManager, sessionManager) {

        var vm = $scope.vm = {};

        vm.slug = $stateParams.slug;
        vm.categoryId = Number($stateParams.categoryId) || '';
        vm.articleId = Number($stateParams.articleId) || '';
        vm.hasAuthentication = bbsUtils.hasAuthentication;
        vm.getImgUrl = bbsUtils.getImgUrl;
        vm.session = sessionManager.session;
        vm.isLoggedIn = sessionManager.isLoggedIn;
        vm.hasReadRole = hasReadRole;
        vm.hasWriteRole = hasWriteRole;
        vm.isAdmin = isAdmin;
        vm.domainPath = "";

        var path = $location.path();
        var pathArr = path.split("/");

        for (var i = 0; i < pathArr.length; ++i) {
            if (pathArr[i] == metaManager.std.prefix.board) {
                break;
            }
        }

        for (var j = 0; j < i; ++j) {
            if (pathArr[j] != '') {
                vm.domainPath += ("/" + pathArr[j]);
            }
        }

        findBbs();

        function attachPaths(board) {
            var skinPath = bbsUtils.getResourcePaths(board);
            vm.pathCSS = skinPath.pathCSS;
            vm.pathHTML = skinPath.pathHTML;
        }

        function findBbs() {
            var searchObj = $location.search();
            bbsManager.findBbs(
                vm.slug,
                vm.categoryId,
                vm.articleId,
                searchObj.nick,
                searchObj.title,
                searchObj.last,
                null,
                function(status, data) {
                    if (status == 200) {
                        vm.data = data;
                        vm.data.categories = data.board.categories;
                        attachPaths(data.board);
                        $css.add(vm.pathCSS);
                    } else {

                    }
                }
            );
        }

        function isAdmin() {
            var ROLE_ADMIN = metaManager.std.user.roleAdmin;
            return (vm.session && vm.session.role && vm.session.role >= ROLE_ADMIN);
        }

        function hasReadRole(board) {
            var role = metaManager.std.user.roleUser;
            if (vm.isLoggedIn()) {
                role = vm.session.role;
            }
            return board.roleRead <= role;
        }

        function hasWriteRole(board) {
            if (vm.isLoggedIn()) {
                return board.roleWrite <= vm.session.role;
            } else {
                return false;
            }
        }
    }

})();
