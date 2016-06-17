import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'GET',
  path: '/permissions/{id}',
  config: {
    tags: ['api', 'permissions'],
    description: 'Gets a permission\'s info',
    notes: 'Returns the permission\'s details.',
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
      const { Role } = request.models;
      const { Resource } = request.models;
      const { Action } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Permission.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' });
      Permission.belongsTo(Resource, { foreignKey: 'ResourceId', as: 'Resource' });
      Permission.belongsTo(Action, { foreignKey: 'ActionId', as: 'Action' });

      Permission.findOne({
        where: {
          id: request.params.id
        },
        include: [
          {
            model: Role,
            as: 'Role',
            required: true
          },
          {
            model: Resource,
            as: 'Resource',
            required: true
          },
          {
            model: Action,
            as: 'Action',
            required: true
          }
        ]
      })
      .then(permission => {
        if (!permission) throw Boom.notFound('No permission found.');

        return permission.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
