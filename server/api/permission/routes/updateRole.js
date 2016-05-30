import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'PUT',
  path: '/roles/{id}',
  config: {
    tags: ['api', 'roles'],
    description: 'Updates a role',
    notes: 'Updates a role and returns fail or success.',
    auth: false,
    cors: true,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
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
      const payload = request.payload;

      if (!Object.keys(payload).length) throw Boom.badRequest('Your payload is empty.');

      const { Role } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Role.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(role => {
        if (!role) throw Boom.notFound('No role found.');

        payload.prettyName = payload.name.toLowerCase().replace(/\s/g, '_')
          .replace(/\W/g, '');

        return role.set(payload).save();
      })
      .then(updatedRole => {
        return updatedRole.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
