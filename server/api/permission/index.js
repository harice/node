'use strict';

import createNewAction from './routes/createNewAction';
import fetchAction from './routes/fetchAction';
import updateAction from './routes/updateAction';
import deleteAction from './routes/deleteAction';
import getAction from './routes/getAction';

exports.register = (server, options, next) => {
  server.route(createNewAction);
  server.route(fetchAction);
  server.route(updateAction);
  server.route(deleteAction);
  server.route(getAction);

  next();
}

exports.register.attributes = {
  name: 'action',
}
