import termsResources from './services/core.terms.constant';
import Terms from './services/core.terms.model';
import termsManager from './services/core.terms.manager';
import TermsCtrl from './controllers/core.terms.controller';
import CreateTermsCtrl from './controllers/core.create-terms.controller';
import createTerms from './directives/create-terms/core.create-terms';
import routes from './config/core.terms.route';

import 'angularjs-datepicker';

export default angular.module("core.terms", ['720kb.datepicker'])
    .config(routes)
    .constant("termsResources", termsResources)
    .factory("Terms", Terms)
    .service("termsManager", termsManager)
    .controller("TermsCtrl", TermsCtrl)
    .controller("CreateTermsCtrl", CreateTermsCtrl)
    .directive("createTerms", createTerms)
    .name;