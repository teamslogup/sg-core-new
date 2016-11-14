import termsResources from './services/core.terms.constant';
import Terms from './services/core.terms.model';
import termsManager from './services/core.terms.manager';
import TermsCtrl from './controllers/core.terms.controller';
import CreateTermsCtrl from './controllers/core.create-terms.controller';
import AddTermsVersionCtrl from './controllers/core.add-terms-version.controller';
import createTerms from './directives/create-terms/core.create-terms';
import addTermsVersion from './directives/add-terms-version/core.add-terms-version';
import routes from './config/core.terms.route';

import 'angularjs-datepicker';

export default angular.module("core.terms", ['720kb.datepicker'])
    .config(routes)
    .constant("termsResources", termsResources)
    .factory("Terms", Terms)
    .service("termsManager", termsManager)
    .controller("TermsCtrl", TermsCtrl)
    .controller("CreateTermsCtrl", CreateTermsCtrl)
    .controller("AddTermsVersionCtrl", AddTermsVersionCtrl)
    .directive("createTerms", createTerms)
    .directive("addTermsVersion", addTermsVersion)
    .name;