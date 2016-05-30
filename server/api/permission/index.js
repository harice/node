'use strict';

import createNewAction from './routes/createNewAction';
import fetchAction from './routes/fetchAction';
import updateAction from './routes/updateAction';
import deleteAction from './routes/deleteAction';
import getAction from './routes/getAction';

import createNewRole from './routes/createNewRole';
import updateRole from './routes/updateRole';
import deleteRole from './routes/deleteRole';
import getRole from './routes/getRole';
import fetchRoles from './routes/fetchRoles';

import createNewResource from './routes/createNewResource';
import getResource from './routes/getResource';
import updateResource from './routes/updateResource';
import deleteResource from './routes/deleteResource';
import fetchResources from './routes/fetchResources';

import createPermission from './routes/createPermission';

exports.register = (server, options, next) => {

  server.route(createNewAction);
  server.route(fetchAction);
  server.route(updateAction);
  server.route(deleteAction);
  server.route(getAction);

  server.route(createNewRole);
  server.route(updateRole);
  server.route(deleteRole);
  server.route(getRole);
  server.route(fetchRoles);

  server.route(createNewResource);
  server.route(getResource);
  server.route(updateResource);
  server.route(deleteResource);
  server.route(fetchResources);

  server.route(createPermission);

  next();
}

exports.register.attributes = {
   name: 'permission'
 }
