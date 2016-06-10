import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'POST',
  path: '/permissions',
  config: {
    tags: ['api', 'permissions'],
    description: 'Creates a new permission',
    notes: 'Takes a new permission information.',
    auth: false,
    cors: true,
    validate: {
      payload: {
        roleId: Joi.number().integer().min(1).required(),
        resourceId: Joi.number().integer().min(1).required(),
        actionId: Joi.number().integer().min(1).required()
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
      const { Resource } = request.models;
      const { Action } = request.models;
      const { Permission } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      const roleId = request.payload.roleId;
      const resourceId = request.payload.resourceId;
      const actionId = request.payload.actionId;

      Role.findById(roleId)
      .then(role => {
        if (!role) throw Boom.notFound('No role found.');

        return Resource.findById(resourceId);
      })
      .then(resource => {
        if (!resource) throw Boom.notFound('No resource found.');

        return Action.findById(actionId);
      })
      .then(action => {
        if (!action) throw Boom.notFound('No action found.');

        return Permission.findOne({
          where: {
            RoleId: roleId,
            ResourceId: resourceId,
            ActionId: actionId
          }
        });
      })
      .then(permission => {
        if (permission) {
          return permission;
        }

        const p = Permission.build({
          RoleId: roleId,
          ResourceId: resourceId,
          ActionId: actionId
        });

        return p.save();
      })
      .then(savedPermission => {
        return savedPermission.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
