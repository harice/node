import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'DELETE',
  path: '/roles/{id}',
  config: {
    tags: ['api', 'roles'],
    description: 'Deletes a role',
    notes: 'Deletes a role and returns fail or success.',
    auth: false,
    cors: true,
    validate: {
      params: {
        id: Joi.number().integer().required()
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

      Role.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(role => {
        if (!role) throw Boom.notFound('No role found.');

        return role.destroy();
      })
      .then(deletedRole => {
        return { deletedAt: deletedRole.deletedAt };
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
