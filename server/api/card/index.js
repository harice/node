'use strict';

import createCard from './routes/createCard';
import getCards from './routes/getCards';
import getCard from './routes/getCard';
import updateCard from './routes/updateCard';
import deleteCard from './routes/deleteCard';

exports.register = (server, options, next) => {
  server.route(createCard);
  server.route(getCard);
  server.route(getCards);
  server.route(updateCard);
  server.route(deleteCard);

  next();
}

exports.register.attributes = {
  name: 'card',
}
