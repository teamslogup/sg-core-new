import angular from 'angular';

angular
    .module('core.base')
    .factory('Upload', Upload);

/* @ngInject */
function Upload($resource) {
    return $resource('/api/etc/upload', {}, {});
}
