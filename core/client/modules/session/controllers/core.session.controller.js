(function () {
    'use strict';

    angular.module("core.session").controller("SessionCtrl", SessionCtrl);

    /* @ngInject */
    function SessionCtrl($scope, $rootScope, $location, sessionManager, errorHandler, metaManager, oauthManager) {
        var vm = $scope.vm = {};
        vm.login = login;
        vm.signup = signup;
        vm.findPass = findPass;
        vm.changePass = changePass;
        vm.STD = metaManager.std;
        vm.getFormError = errorHandler.getFormError;
        vm.isInvalid = errorHandler.isInvalid;

        vm.goToFacebook = function () {
            location.href = '/oauth/facebook?signup=http://local.slogup.com:3001/sample/accounts/signup&redirect=http://local.slogup.com:3001/sample/boards/slug1&fail=/fail';
        };

        if (sessionManager.isLoggedIn()) {
            $location.href = "/";
        }

        vm.oauth = oauthManager;
        if (!vm.form) vm.form = {};
        vm.form.email = ((oauthManager.facebook && oauthManager.facebook.email) || (oauthManager.twitter && oauthManager.twitter.email)) || '';
        vm.form.nick = ((oauthManager.facebook && oauthManager.facebook.nick) || (oauthManager.twitter && oauthManager.twitter.nick)) || '';

        function findPass() {
            var email = vm.form.email;
            sessionManager.sendFindPassEmail(email, function (status, data) {
                if (status == 200) {
                    $rootScope.$broadcast("core.session.callback", {
                        type: 'findPass'
                    });
                } else {
                    errorHandler.alertError(status, data);
                }
            });
        }

        function changePass() {
            if (!$location.search() || !$location.search().token) {
                return alert("잘못된 요청입니다.");
            }

            var token = $location.search().token;
            token = token.replace(/\s/g, "+");

            var pass = vm.form.newPass;
            if (!pass) {
                return alert("비밀번호를 입력해주세요.");
            }

            sessionManager.changePassWithToken(pass, token, function (status, data) {
                if (status == 200) {
                    $rootScope.$broadcast("core.session.callback", {
                        type: 'changePass'
                    });
                } else {
                    errorHandler.alertError(status, data);
                }
            });
        }

        function login(form) {
            if (form.$valid) {
                sessionManager.loginWithEmail(vm.form.email, vm.form.pass, function (status, data) {
                    if (status == 200) {
                        $rootScope.$broadcast("core.session.callback", {
                            type: 'login'
                        });
                    } else {
                        errorHandler.alertError(status, data);
                    }
                });
            } else {
                alert("올바른 정보를 입력해 주세요");
            }
        }

        function signup(form) {
            if (vm.form.pass != vm.form.repass) {
                return alert("비밀번호를 확인해주세요.")
            }

            if (form.$valid) {
                var user = {
                    secret: vm.form.pass,
                    uid: vm.form.email,
                    nick: vm.form.nick,
                    agreedEmail: true,
                    type: metaManager.std.user.signUpTypeEmail
                };

                sessionManager.signup(user, function (status, data) {
                    if (status == 201) {
                        $rootScope.$broadcast("core.session.callback", {
                            type: 'signup'
                        });
                    } else {
                        errorHandler.alertError(status, data);
                    }
                });
            } else {
                alert("올바른 정보를 입력해 주세요");
            }
        }
    }

})();
