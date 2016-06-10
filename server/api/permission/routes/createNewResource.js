import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/resources',
  config: {
    tags: ['api', 'resources'],
    description: 'Creates a new resource',
    notes: 'Takes a resource information and returns the resource info.',
    auth: false,
    cors: true,
    validate: {
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
      const { Resource } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      const r = Resource.build({
        name: request.payload.name,
        prettyName: request.payload.name.toLowerCase().replace(/\s/g, '_')
          .replace(/\W/g, '')
      });

      r.save()
      .then(savedResource => {
        return savedResource.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
    }
  }
}
