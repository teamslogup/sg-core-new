
import svgImage from './svg-image/core.common.svg-image';
import StaticLoader from './static-loader/core.common.static-loader';
import errSrc from './err-src/core.common.err-src';

export default angular.module('core.common', [])
    .directive(svgImage)
    .directive(errSrc)
    .provider('staticLoader', StaticLoader)
    .name;
