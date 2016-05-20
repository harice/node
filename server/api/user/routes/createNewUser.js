import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/users',
  config: {
    tags: ['api', 'users'],
    description: 'Creates a new user',
    notes: 'Takes a new users information and returns the user info',
    auth: false,
    cors: true,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '400': {'description': 'Validation error'},
          '500': {'description': 'Internal Server Error'}
        }
      }
    },
    handler: (request, reply) => {
      const { User } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      const u = User.build({
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password
      });

      u.save()
        .then(savedUser => {
          return savedUser.sanitizeForResponse();
        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);

    }
  }
}
