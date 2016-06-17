import Joi from 'joi';
import Sequelize from 'sequelize';
import _ from 'lodash';

export default {
  method: 'GET',
  path: '/roles/{id}/users',
  config: {
    tags: ['api', 'roles', 'users'],
    description: 'Gets a list of users for role',
    notes: "Returns all the users for a role.",
    auth: false,
    cors: true,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      query: {
        search: Joi.string().default('').optional(),
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
      const { User } = request.models;
      const { UserRole } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      const order = (request.query.asc) ? 'asc' : 'desc';

      const sanitizeForResponse = function(n) {
        return n.sanitizeForResponse();
      };
      User.hasOne(UserRole, { foreignKey: 'UserId', as: 'UserRole' });

      User.findAndCountAll({
        where: {
          $or: [
            {
              firstName: {
                $iLike: '%' + request.query.search + '%'
              }
            },
            {
              lastName: {
                $iLike: '%' + request.query.search + '%'
              }
            }
          ]
        },
        include: [
          {
            model: UserRole,
            as: 'UserRole',
            required: true,
            where: {
              RoleId: request.params.id
            },
            attributes: []
          },
        ],
        offset: request.query.offset,
        limit: request.query.limit,
        order: [
          ['createdAt', order]
        ]
      })
      .then(userResult => {
        if (userResult.count) {
          userResult.rows = _.map(userResult.rows, sanitizeForResponse);
        }

        return userResult ;
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
