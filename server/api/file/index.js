'use strict';

import uploadImage from './routes/uploadImage';

exports.register = (server, options, next) => {
  server.route(uploadImage);

  next();
}

exports.register.attributes = {
  name: 'file',
}
