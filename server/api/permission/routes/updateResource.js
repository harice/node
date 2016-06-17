import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'PUT',
  path: '/resources/{id}',
  config: {
    tags: ['api', 'resources'],
    description: 'Updates a resource',
    notes: 'Updates a resource and returns fail or success.',
    auth: false,
    cors: true,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      payload: {
        name: Joi.string().trim().required()
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
      const payload = request.payload;

      if (!Object.keys(payload).length) throw Boom.badRequest('Your payload is empty.');

      const { Resource } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Resource.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(resource => {
        if (!resource) throw Boom.notFound('No role found.');

        payload.prettyName = payload.name.toLowerCase().replace(/\s/g, '_')
          .replace(/\W/g, '');

        return resource.set(payload).save();
      })
      .then(updatedResource => {
        return updatedResource.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
