'use strict';

import convertValidationErrors from './lib/convertValidationErrors';
import processOperationalErrors from './lib/processOperationalErrors';
import consoleLogGeneralErrors from './lib/consoleLogGeneralErrors';
import streamFileToS3 from './lib/streamFileToS3';
import streamFileToS3v2 from './lib/streamFileToS3v2';
import deleteFileToS3 from './lib/deleteFileToS3';

exports.register = (server, options, next) => {

  // Expose some shared functions for use throughout the server
  server.expose({
    processOperationalErrors: processOperationalErrors(server),
    convertValidationErrors,
    consoleLogGeneralErrors,
    streamFileToS3,
    streamFileToS3v2,
    deleteFileToS3,
  })

  // Make the Sequelize models easily accessible from the request object
  server.ext('onPreAuth', (request, reply) => {
      request.models = server.plugins.sequelize.db.sequelize.models;
      reply.continue();
  });

  next();

}

exports.register.attributes = {
  name: 'common',
  version: '1.0.0'
}
