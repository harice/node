import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';
import _ from 'lodash';

export default {
  method: 'GET',
  path: '/roles',
  config: {
    tags: ['api', 'roles'],
    description: 'Gets a list of roles',
    notes: "Returns all the roles.",
    auth: false,
    cors: true,
    validate: {
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
      const { Role } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const order = (request.query.asc) ? 'asc' : 'desc';

      const sanitizeForResponse = function(n) {
        return n.sanitizeForResponse();
      };

      Role.findAndCountAll({
        where: {
          name: {
            $iLike: '%' + request.query.search + '%'
          }
        },
        offset: request.query.offset,
        limit: request.query.limit,
        order: [
          ['createdAt', order]
        ]
      })
      .then(roleResult => {
        if (roleResult.count) {
          roleResult.rows = _.map(roleResult.rows, sanitizeForResponse);

          return roleResult;
        }

        throw Boom.notFound('No roles found.');
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
