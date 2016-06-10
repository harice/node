import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'GET',
  path: '/actions',
  config: {
    tags: ['api', 'actions'],
    description: 'Gets a list of actions.',
    notes: "Returns all the actions.",
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
      const { Action } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const order = (request.query.asc) ? 'asc' : 'desc';

      Action.findAndCountAll({
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
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);
    }
  }
}
