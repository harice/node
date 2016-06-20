'use strict';

import createNewUser from './routes/createNewUser';
import getAuthedUser from './routes/getAuthedUser';

//import uploadAvatarImage from './routes/uploadAvatarImage';

exports.register = (server, options, next) => {
  server.route(createNewUser);
  server.route(getAuthedUser);

  //server.route(uploadAvatarImage);

  next();
}

exports.register.attributes = {
  name: 'user',
}
