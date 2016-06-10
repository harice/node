import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';
import _ from 'lodash';

export default {
  method: 'GET',
  path: '/permissions',
  config: {
    tags: ['api', 'permissions'],
    description: 'Gets a list of permissions',
    notes: "Returns all the permissions.",
    auth: false,
    cors: true,
    validate: {
      query: {
        roleId: Joi.number().integer().default(0).optional(),
        resourceId: Joi.number().integer().default(0).optional(),
        actions: Joi.array().items(Joi.number().integer().min(1)).optional(),
        asc: Joi.boolean().default(true),
        limit: Joi.number().integer().min(1).default(25),
        offset: Joi.number().integer().default(0)
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

      const direction = (request.query.asc) ? 'asc' : 'desc';

      const sanitizeForResponse = function(n) {
        return n.sanitizeForResponse();
      };

      let where = {};

      if (request.query.roleId) {
        where.RoleId = request.query.roleId;
      }

      if (request.query.resourceId) {
        where.ResourceId = request.query.resourceId;
      }

      if (request.query.actions) {
        where.ActionId = {
          $in: request.query.actions
        };
      }

      Permission.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' });
      Permission.belongsTo(Resource, { foreignKey: 'ResourceId', as: 'Resource' });
      Permission.belongsTo(Action, { foreignKey: 'ActionId', as: 'Action' });

      Permission.findAndCountAll({
        where: where,
        offset: request.query.offset,
        limit: request.query.limit,
        order: [
          ['createdAt', direction]
        ],
        include: [
          {
            model: Role,
            as: 'Role',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
          },
          {
            model: Resource,
            as: 'Resource',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
          },
          {
            model: Action,
            as: 'Action',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
          }
        ]
      })
      .then(permissionResult => {
        if (permissionResult.count) {
          permissionResult.rows = _.map(permissionResult.rows, sanitizeForResponse);

          return permissionResult;
        }

        throw Boom.notFound('No permissions found.');
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
    }
  }
}
