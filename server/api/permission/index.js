'use strict';

import createNewRole from './routes/createNewRole';
import updateRole from './routes/updateRole';
import deleteRole from './routes/deleteRole';
import getRole from './routes/getRole';
import fetchRoles from './routes/fetchRoles';

exports.register = (server, options, next) => {
  server.route(createNewRole);
  server.route(updateRole);
  server.route(deleteRole);
  server.route(getRole);
  server.route(fetchRoles);

  next();
}

exports.register.attributes = {
  name: 'role',
}
