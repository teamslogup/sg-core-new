(function () {
    'use strict';

    angular
        .module('core.bbs')
        .service('bbsUtils', bbsUtils);

    /* @ngInject */
    function bbsUtils($state, sessionManager, metaManager) {

        this.hasAuthentication = hasAuthentication;
        this.getResourcePaths = getResourcePaths;
        this.getListUrl = getListUrl;
        this.getDetailUrl = getDetailUrl;
        this.getFormUrl = getFormUrl;
        this.getImgUrl = getImgUrl;

        var session = sessionManager.session;

        var prefix = metaManager.std.prefix.board;

        function getImgUrl(article, folder) {
            var std = metaManager.std;
            if (!article.img) return false;
            if (!folder) folder = std.file.folderArticle;
            return std.cdn.rootUrl + "/" + folder + "/" + article.img;
        }

        function hasAuthentication(authorId) {
            return (authorId && session.id == authorId || session.role >= metaManager.std.user.roleAdmin);
        }

        function getResourcePaths(board) {
            var resourcePackage = {};
            var skinName = board.skin;
            var rootPath = "modules/bbs/skins/";

            var name = $state.current.name;
            var nameArr = name.split(".");
            for (var i = 0; i < nameArr.length; ++i) {
                var nameComp = nameArr[i];
                if (nameComp == 'list' || nameComp == 'list-with-category') {
                    resourcePackage.pathHTML = rootPath + skinName + "/views/" + "list.html";
                    break;
                } else if (nameComp == 'detail') {
                    resourcePackage.pathHTML = rootPath + skinName + "/views/" + "detail.html";
                } else if (nameComp == 'create' || nameComp == 'edit') {
                    resourcePackage.pathHTML = rootPath + skinName + "/views/" + "form.html";
                }
            }

            resourcePackage.pathCSS = rootPath + skinName + "/assets/stylesheets/skin.css";
            return resourcePackage;
        }

        function getListUrl(slug, categoryId) {
            if (categoryId) {
                return "/" + prefix + "/" + slug + "/" + categoryId;
            } else {
                return "/" + prefix + "/" + slug;
            }
        }

        function getDetailUrl(slug, categoryId, articleId) {
            return "/" + prefix + "/" + slug + "/" + categoryId + "/" + articleId;
        }

        function getFormUrl(slug, categoryId, articleId) {
            if (categoryId && articleId) {
                return "/" + prefix + "/" + slug + "/" + categoryId + "/" + articleId + "/edit";
            } else if (categoryId && !articleId) {
                return "/" + prefix + "/" + slug + "/" + categoryId + "/create";
            } else {
                return "/" + prefix + "/" + slug + "/create";
            }
        }
    }

})();