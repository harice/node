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
        phoneNumber: Joi.string().optional(),
        company: Joi.string().optional(),
        gender: Joi.string().optional(),
        address1: Joi.string().optional(),
        address2: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        zipcode: Joi.string().optional()
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

      User.build({
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password,
        phoneNumber: request.payload.phoneNumber,
        gender: request.payload.gender,
        company: request.payload.company,
        address1: request.payload.address1,
        address2: request.payload.address2,
        city: request.payload.city,
        state: request.payload.state,
        country: request.payload.country,
        zipcode: request.payload.zipcode
      }).save()
      .then(savedUser => {
        return savedUser.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
    }
  }
}
