import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'GET',
  path: '/resources',
  config: {
    tags: ['api', 'resources'],
    description: 'Gets a list of resources',
    notes: "Returns all the resources.",
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
      const { Resource } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const order = (request.query.asc) ? 'asc' : 'desc';

      Resource.findAndCountAll({
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
