webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _coreBase = __webpack_require__(1);
	
	var _coreBase2 = _interopRequireDefault(_coreBase);
	
	var _coreSample = __webpack_require__(18);
	
	var _coreSample2 = _interopRequireDefault(_coreSample);
	
	var _coreSample3 = __webpack_require__(19);
	
	var _coreSample4 = _interopRequireDefault(_coreSample3);
	
	var _coreSampleMain = __webpack_require__(20);
	
	var _coreSampleMain2 = _interopRequireDefault(_coreSampleMain);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CORE_SAMPLE_APP_NAME = "core.sample";
	
	angular.module(CORE_SAMPLE_APP_NAME, [_coreBase2.default]).config(_coreSample2.default).config(_coreSample4.default).controller('mainCtrl', _coreSampleMain2.default);
	
	if (window.location.hash === '#_=_') window.location.hash = '';
	
	angular.element(document).ready(function () {
	    angular.bootstrap(document, [CORE_SAMPLE_APP_NAME]);
	});
	
	exports.default = CORE_SAMPLE_APP_NAME;

/***/ },

/***/ 18:
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

/***/ 19:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = routes;
	routes.$inject = ['$stateProvider'];
	
	function routes($stateProvider) {
	    $stateProvider.state('index', {
	        url: '/sample',
	        views: {
	            'header': {
	                templateUrl: 'pages/sample/views/layouts/header.html'
	            },
	            'footer': {
	                templateUrl: 'pages/sample/views/layouts/footer.html'
	            },
	            'contents': {
	                templateUrl: 'pages/sample/views/layouts/main-contents.html'
	            }
	        }
	    }).state('route1', {
	        abstract: true,
	        url: '/sample/:contentName/:subContentName',
	        views: {
	            'header': {
	                templateUrl: 'pages/sample/views/layouts/header.html'
	            },
	            'footer': {
	                templateUrl: 'pages/sample/views/layouts/footer.html'
	            },
	            'contents': {
	                templateUrl: 'pages/sample/views/layouts/sub-contents.html'
	            }
	        }
	    }).state('route1.body', {
	        url: "",
	        templateUrl: function templateUrl($stateParams) {
	            var contentName = $stateParams.contentName;
	            if ($stateParams.contentName != 'route1' && $stateParams.contentName != 'route2') {
	                contentName = "otherwise";
	            }
	            return '/pages/sample/views/contents/' + contentName + '.html';
	        }
	    });
	}

/***/ },

/***/ 20:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.default = mainCtrl;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	mainCtrl.$inject = ['$scope', '$translate', '$location'];
	
	var Hwarang = function () {
	    function Hwarang(age) {
	        _classCallCheck(this, Hwarang);
	
	        this.age = age;
	    }
	
	    _createClass(Hwarang, [{
	        key: 'getAge',
	        value: function getAge() {
	            return this.age;
	        }
	    }, {
	        key: 'print',
	        value: function print() {
	            console.log(this.getAge());
	        }
	    }]);
	
	    return Hwarang;
	}();
	
	function mainCtrl($scope, $location) {
	    // staticLoader.get('route1.json', function (status, data) {
	    //     $scope.contents = data;
	    // });
	    var hwarang = new Hwarang(100);
	    hwarang.print();
	}

/***/ }

});
//# sourceMappingURL=sg-sample.js.map