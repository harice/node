'use strict';

import createNewUser from './routes/createNewUser';
import getAuthedUser from './routes/getAuthedUser';

exports.register = (server, options, next) => {
  server.route(createNewUser);
  server.route(getAuthedUser);

  next();
}

exports.register.attributes = {
  name: 'user',
}
