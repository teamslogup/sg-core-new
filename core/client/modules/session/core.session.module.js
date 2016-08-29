import coreBaseModule from '../base/core.base.module';
import users from '../users/core.users.module';

import routing from './config/core.session.route';
import SessionCtrl from './controllers/core.session.controller';
import sessionResources from './services/core.session.constants';
import Session from './services/core.session.model';
import Pass from './services/core.session.pass.model';
import SenderEmail from './services/core.session.sender-email.model';
import sessionManager from './services/core.session.manager';
import oauthManager from './services/core.session.oauth.manager';

export default angular.module("core.session", [
    coreBaseModule,
    users
])
    .config(routing)
    .controller("SessionCtrl", SessionCtrl)
    .constant("sessionResources", sessionResources)
    .factory("Session", Session)
    .factory("Pass", Pass)
    .factory("SenderEmail", SenderEmail)
    .service("sessionManager", sessionManager)
    .service("oauthManager", oauthManager)
    .name;