import termsResources from './services/core.terms.constant';
import Terms from './services/core.terms.model';
import termsManager from './services/core.terms.manager';
import TermsCtrl from './controllers/core.terms.controller';

export default angular.module("core.terms", [])
    .constant("termsResources", termsResources)
    .factory("Terms", Terms)
    .service("termsManager", termsManager)
    .controller("TermsCtrl", TermsCtrl)
    .name;