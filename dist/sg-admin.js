webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _coreBase = __webpack_require__(1);
	
	var _coreBase2 = _interopRequireDefault(_coreBase);
	
	var _appAdmin = __webpack_require__(12);
	
	var _appAdmin2 = _interopRequireDefault(_appAdmin);
	
	var _appAdmin3 = __webpack_require__(13);
	
	var _appAdmin4 = _interopRequireDefault(_appAdmin3);
	
	var _appAdmin5 = __webpack_require__(14);
	
	var _appAdmin6 = _interopRequireDefault(_appAdmin5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var APP_MAIN_APP_NAME = "app.admin";
	
	angular.module(APP_MAIN_APP_NAME, [_coreBase2.default]).config(_appAdmin2.default).config(_appAdmin4.default).controller('MainCtrl', _appAdmin6.default);
	
	if (window.location.hash === '#_=_') window.location.hash = '';
	
	angular.element(document).ready(function () {
	    angular.bootstrap(document, [APP_MAIN_APP_NAME]);
	});
	
	exports.default = APP_MAIN_APP_NAME;

/***/ },

/***/ 12:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = routing;
	routing.$inject = ['$urlRouterProvider', '$locationProvider'];
	
	function routing($urlRouterProvider, $locationProvider) {
	    $locationProvider.html5Mode(true).hashPrefix('!');
	    // staticLoaderProvider.setRootPath("pages/sample/assets/contents/");
	    // var mix = metaManagerProvider.getMixed();
	    // for (var k in mix) {
	    //     $translateProvider.translations(k, mix[k]);
	    // }
	    // $translateProvider.preferredLanguage('en');
	}

/***/ },

/***/ 13:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = routes;
	routes.$inject = ['$stateProvider'];
	
	function routes($stateProvider) {
	    $stateProvider.state('index', {
	        url: '/',
	        views: {
	            'header': {
	                templateUrl: 'pages/main/views/layouts/header.html'
	            },
	            'footer': {
	                templateUrl: 'pages/main/views/layouts/footer.html'
	            },
	            'contents': {
	                templateUrl: 'pages/main/views/layouts/main-contents.html'
	            }
	        }
	    });
	}

/***/ },

/***/ 14:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.default = MainCtrl;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	MainCtrl.$inject = ['$scope', '$translate', '$location'];
	
	var Hwarang = function () {
	    function Hwarang(age) {
	        _classCallCheck(this, Hwarang);
	
	        this.age = age;
	    }
	
	    _createClass(Hwarang, [{
	        key: 'log',
	        value: function log() {
	            console.log(this.age);
	        }
	    }]);
	
	    return Hwarang;
	}();
	
	function MainCtrl($scope, $location) {
	    // staticLoader.get('route1.json', function (status, data) {
	    //     $scope.contents = data;
	    // });
	    var hwarang = new Hwarang(30);
	    hwarang.log();
	}

/***/ }

});
//# sourceMappingURL=sg-admin.js.map