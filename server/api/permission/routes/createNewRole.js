import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/roles',
  config: {
    tags: ['api', 'roles'],
    description: 'Creates a new role',
    notes: 'Takes a new role information and returns the role info.',
    auth: false,
    cors: true,
    validate: {
      payload: {
        name: Joi.string().trim().required()
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
      const { Role } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      const r = Role.build({
        name: request.payload.name,
        prettyName: request.payload.name.toLowerCase().replace(/\s/g, '_')
          .replace(/\W/g, '')
      });

      r.save()
      .then(savedRole => {
        return savedRole.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
