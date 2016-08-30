
import svgImage from './svg-image/core.common.svg-image';
import StaticLoader from './static-loader/core.common.static-loader';
import errSrc from './err-src/core.common.err-src';
import inputPass from './input-pass/core.common.input-pass';

export default angular.module('core.common', [])
    .directive(svgImage)
    .directive(errSrc)
    .directive('inputPass', inputPass)
    .provider('staticLoader', StaticLoader)
    .name;
