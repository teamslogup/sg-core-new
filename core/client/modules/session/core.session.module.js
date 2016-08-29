import users from '../users/core.users.module';

import sessionResources from './services/core.session.constants';
import Session from './services/core.session.model';
import Pass from './services/core.session.pass.model';
import SenderEmail from './services/core.session.sender-email.model';
import sessionManager from './services/core.session.manager';
import oauthManager from './services/core.session.oauth.manager';

export default angular.module("core.session", [
    users
])
    .constant("sessionResources", sessionResources)
    .factory("Session", Session)
    .factory("Pass", Pass)
    .factory("SenderEmail", SenderEmail)
    .service("sessionManager", sessionManager)
    .service("oauthManager", oauthManager)
    .name;