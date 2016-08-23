import coreCommon from '../../components/core.common.module';
import uiRouter from 'angular-ui-router';
import translate from 'angular-translate';
import cookies from 'angular-cookies';
import ngResource from 'angular-resource';

export default angular.module("core.base", [
    coreCommon,
    uiRouter,
    translate,
    cookies,
    ngResource
]).name;