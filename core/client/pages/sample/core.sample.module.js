
import coreBaseModule from '../../modules/base/core.base.module';

import config from './config/core.sample.config';
import routing from './config/core.sample.route';

import mainCtrl from './controllers/core.sample.main.controller';

const CORE_SAMPLE_APP_NAME = "core.sample";

angular.module(CORE_SAMPLE_APP_NAME, [coreBaseModule])
    .config(config)
    .config(routing)
    .controller('mainCtrl', mainCtrl);

if (window.location.hash === '#_=_') window.location.hash = '';

angular.element(document).ready(function () {
    angular.bootstrap(document, [CORE_SAMPLE_APP_NAME]);
});

export default CORE_SAMPLE_APP_NAME;
