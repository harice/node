'use strict';

import Boom from 'boom';
import Sequelize from 'sequelize';
import _ from 'lodash';

export default {
  method: ['GET', 'POST'],
  path: '/auth/google/callback',
  config: {
    tags: ['api', 'users'],
    auth: 'google',
    cors: true,
    plugins: {
      'hapi-swagger': {
        responses: {
          '400': {'description': 'Validation error'},
          '500': {'description': 'Internal Server Error'}
        }
      }
    },
    handler: function (request, reply) {
      if (!request.auth.isAuthenticated) {
        return reply('Authentication failed due to: ' + request.auth.error.message);
      }

      const { User } = request.models;
      const { UserIdpProfile } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      let data = request.auth.credentials;

      UserIdpProfile.findOrCreate({
        where: {
          profileId: data.profile.id
        },
        defaults: {
          profileId: data.profile.id,
          provider: data.provider
        }
      }).then(userIdpProfile => {
        if (!userIdpProfile[0]) {
          throw Boom.badRequest("Something went wrong, please try again.");
        }

        return User.findOrCreate({
          where: {
            email: data.profile.emails[0].value || null
          },
          defaults: {
            firstName: data.profile.name.givenName,
            lastName: data.profile.name.familyName,
            email: data.profile.emails[0].value,
            password: data.profile.emails[0].value,
            userIdpProfileId: userIdpProfile[0].id
          }
        }).then(user => {
          if (!user[0]) {
            throw Boom.badRequest("Something went wrong, please try again.");
          }

          return _.set(user[0].sanitizeForResponse(),
            'token', user[0].generateToken()
            );
        })
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
    }
  }
}
