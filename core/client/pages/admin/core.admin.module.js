import coreBaseModule from '../../modules/base/core.base.module';
import users from '../../modules/users/core.users.module';
import session from '../../modules/session/core.session.module';

import routing from './config/core.admin.route';
import AdminCtrl from './controllers/core.admin.controller';

export default angular.module("core.admin", [coreBaseModule, users, session])
    .config(routing)
    .controller(AdminCtrl)
    .name;