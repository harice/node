import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'GET',
  path: '/resources/{id}',
  config: {
    tags: ['api', 'resources'],
    description: 'Gets a resource\'s info',
    notes: "Returns the resource\'s details.",
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
      const { Resource } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Resource.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(resource => {
        if (!resource) throw Boom.notFound('No resource found.');

        return resource.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
    }
  }
}
