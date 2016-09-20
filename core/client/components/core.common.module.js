
import svgImage from './svg-image/core.common.svg-image';
import StaticLoader from './static-loader/core.common.static-loader';
import errSrc from './err-src/core.common.err-src';
import inputPass from './input-pass/core.common.input-pass';
import toMicrotime from './to-microtime/core.common.to-microtime';
import fileModel from './file-model/core.common.file-model';
import fileUploader from './file-uploader/core.common.file-uploader';

export default angular.module('core.common', [])
    .directive(svgImage)
    .directive(errSrc)
    .directive('inputPass', inputPass)
    .filter('toMicrotime', toMicrotime)
    .provider('staticLoader', StaticLoader)
    .directive('fileModel', fileModel)
    .service('fileUploader', fileUploader)
    .name;
