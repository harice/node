import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'DELETE',
  path: '/permissions/{id}',
  config: {
    tags: ['api', 'permissions'],
    description: 'Deletes a permission',
    notes: 'Deletes a permission and returns fail or success.',
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
      const { Permission } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Permission.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(permission => {
        if (!permission) throw Boom.notFound('No permission found.');

        return permission.destroy();
      })
      .then(deletedPermission => {
        return { deletedAt: deletedPermission.deletedAt };
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
