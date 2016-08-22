webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _coreBase = __webpack_require__(1);
	
	var _coreBase2 = _interopRequireDefault(_coreBase);
	
	var _appMain = __webpack_require__(15);
	
	var _appMain2 = _interopRequireDefault(_appMain);
	
	var _appMain3 = __webpack_require__(16);
	
	var _appMain4 = _interopRequireDefault(_appMain3);
	
	var _appMain5 = __webpack_require__(17);
	
	var _appMain6 = _interopRequireDefault(_appMain5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var APP_MAIN_APP_NAME = "app.main";
	
	angular.module(APP_MAIN_APP_NAME, [_coreBase2.default]).config(_appMain2.default).config(_appMain4.default).controller('MainCtrl', _appMain6.default);
	
	if (window.location.hash === '#_=_') window.location.hash = '';
	
	angular.element(document).ready(function () {
	    angular.bootstrap(document, [APP_MAIN_APP_NAME]);
	});
	
	exports.default = APP_MAIN_APP_NAME;

/***/ },

/***/ 15:
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

/***/ 16:
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

/***/ 17:
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
//# sourceMappingURL=sg-main.js.map