'use strict';

import AppConfig from '../../config';
import Joi from 'joi';
import Boom from 'boom';
import validateJWT from './strategies/jwt';

exports.register = (server, options, next) => {

  server.auth.strategy('jwt', 'jwt', true, {
    key: AppConfig.get('/security/jwtSecret'),
    validateFunc: validateJWT,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });

  server.route({
    method: 'POST',
    path: '/auth',
    config: {
      tags: ['api', 'auth'],
      description: 'Authenticate a user',
      notes: 'Takes a user and pass and returns a token for an authenticated user',
      auth: false,
      cors: true,
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '401': {'description': 'Invalid credentials'},
            '500': {'description': 'Internal Server Error'}
          }
        }
      },
      handler(request, reply) {
        const { User } = request.models;
        let _user;

        User.findOne({ where: {email: request.payload.email} })
          .then(foundUser => {
            if (!foundUser) throw Boom.unauthorized('invalid login credentials');
            _user = foundUser;
            return _user.comparePassword(request.payload.password);
          })
          .then(passwordMatches => {
            if (!passwordMatches) throw Boom.unauthorized('invalid login credentials');
            const data = _user.sanitizeForResponse();
            data.token = _user.generateToken();
            return data;
          })
          .asCallback(reply);

      }
    }
  });

  next();
}

exports.register.attributes = {
  name: 'auth',
}
