
import svgImage from './svg-image/core.common.svg-image';
import StaticLoader from './static-loader/core.common.static-loader';
import errSrc from './err-src/core.common.err-src';
import inputPass from './input-pass/core.common.input-pass';
import toMicrotime from './to-microtime/core.common.to-microtime';
import microTimeToDate from './microtime-to-date/core.common.microtime-to-date';
import trustAsHtml from './trust-as-html/core.common.trust-as-html';
import roundUp from './round-up/core.common.round-up';
import ckEditor from './ck-editor/core.common.ck-editor';

import fileModel from './file-model/core.common.file-model';
import fileUploader from './file-uploader/core.common.file-uploader';

export default angular.module('core.common', [])
    .directive(svgImage)
    .directive(errSrc)
    .directive('inputPass', inputPass)
    .filter('toMicrotime', toMicrotime)
    .filter('microTimeToDate', microTimeToDate)
    .filter('trustAsHtml', trustAsHtml)
    .filter('roundUp', roundUp)
    .provider('staticLoader', StaticLoader)
    .directive('ckEditor', ckEditor)
    .directive('fileModel', fileModel)
    .service('fileUploader', fileUploader)
    .name;
