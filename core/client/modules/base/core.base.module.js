import coreCommon from '../../components/core.common.module';
import uiRouter from 'angular-ui-router';
import translate from 'angular-translate';
import cookies from 'angular-cookies';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';

import metaManager from './meta/core.base.meta.manager';
import errorHandler from './error-handler/core.error.handler';
// import Upload from './upload-manager/core.base.upload.model';
// import uploadManager from './upload-manager/core.base.upload-manager';

export default angular.module("core.base", [
    coreCommon,
    uiRouter,
    translate,
    cookies,
    ngResource,
    uiBootstrap
])
    .provider('metaManager', metaManager)
    .service('errorHandler', errorHandler)
    // .factory('Upload', Upload)
    // .service('uploadManager', uploadManager)
    .name;