'use strict';

import Boom from 'boom';
import Sequelize from 'sequelize';
import _ from 'lodash';

export default {
  method: ['GET', 'POST'],
  path: '/auth/facebook/callback',
  config: {
    auth: 'facebook',
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
            email: data.profile.email || null
          },
          defaults: {
            firstName: data.profile.name.first,
            lastName: data.profile.name.last,
            email: data.profile.email,
            password: data.profile.email,
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
