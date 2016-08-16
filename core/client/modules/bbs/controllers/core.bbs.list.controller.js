(function () {
    'use strict';

    angular.module("core.bbs").controller("BbsListCtrl", BbsListCtrl);

    /* @ngInject */
    function BbsListCtrl($scope, $location, bbsUtils, articlesManager, bbsManager, metaManager) {

        var vm = $scope.vm;

        vm.goToWriteForm = goToWriteForm;
        vm.changeCategory = changeCategory;
        vm.goToDetail = goToDetail;
        vm.movePage = movePage;
        vm.filter = filter;

        var serachObj = $location.search();
        var nick = serachObj.nick;
        var title = serachObj.title;

        var form = vm.form = {
            categoryId: vm.categoryId,
            searchType: (nick && 'nick') || (title && 'title') || 'nick',
            searchInput: nick || title
        };

        updatePaging(serachObj.last || 0);

        $scope.$watch('vm.form.categoryId', function (oldValue, newValue) {
            if (oldValue != newValue) {
                $location.search('last', 0);
            }
            $location.path(vm.domainPath + bbsUtils.getListUrl(vm.slug, form.categoryId));
        });

        function goToWriteForm() {
            $location.path(vm.domainPath + "/" + metaManager.std.prefix.board + "/" + vm.slug + "/create");
        }

        function goToDetail(article) {
            if (!vm.categoryId) vm.categoryId = article.category.id;
            $location.path(vm.domainPath + bbsUtils.getDetailUrl(vm.slug, vm.categoryId, article.id));
        }

        function changeCategory(category) {
            vm.categoryId = category.id;
            $location.path(vm.domainPath + bbsUtils.getListUrl(vm.slug, vm.categoryId));
        }

        function filter(last) {
            $location.search('last', last);
            $location.search(form.searchType, form.searchInput);

            var nick = "", title = "";
            if (form.searchType == 'nick') {
                nick = form.searchInput;
            } else if (form.searchType == 'title') {
                title = form.searchInput;
            }

            bbsManager.findBbs(vm.slug, vm.categoryId, null, nick, title, last, null, function (status, data) {
                if (status == 200) {
                    vm.data = data;
                    updatePaging(0);
                } else {

                }
            });
        }

        function movePage (last) {
            $location.search('last', last);
            var searchObj = $location.search();

            articlesManager.findAllArticles(
                vm.slug,
                vm.categoryId,
                null,
                last,
                searchObj.nick || '',
                searchObj.title || '',
                function (status, data) {
                    if (status == 200) {
                        vm.data.articles = data;
                        updatePaging(last);
                    } else {

                    }
                }
            );
        }

        function updatePaging (last) {

            var listSize = serachObj.size || metaManager.std.common.defaultLoadingLength;
            var pageSize = metaManager.std.article.maxPageSize;

            var currentPage = Math.floor(last / listSize);
            var maxPageSize = Math.ceil(vm.data.articleCount / listSize);
            pageSize = (maxPageSize < pageSize) ? maxPageSize : pageSize;

            var currentPageGroup = Math.floor(last / (listSize * pageSize)) * pageSize;
            var prevLast = (currentPage - 1) * listSize;
            prevLast = prevLast < 0 ? 0 : prevLast;

            var nextLast = (currentPage + 1) * listSize;
            var maxLast = (maxPageSize * listSize) - listSize;
            nextLast = nextLast > maxLast ? maxLast : nextLast;

            vm.paging = {
                maxPageSize: maxPageSize,
                currentPage: currentPage,
                last: last,
                listSize: listSize,
                prevLast: prevLast,
                nextLast: nextLast,
                currentPageGroup: currentPageGroup,
                numbers: []
            };

            var lastNum = currentPageGroup + pageSize;
            if (lastNum > maxPageSize) {
                lastNum = maxPageSize;
            }
            for (var i = currentPageGroup; i < lastNum; ++i) {
                vm.paging.numbers.push(i)
            }
        }
    }

})();