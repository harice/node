import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/actions',
  config: {
    tags: ['api', 'action'],
    description: 'Creates a new action',
    notes: 'Takes a new action and returns the action info.',
    cors: true,
    auth : false,
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

      const { Action } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      const a = Action.build({
        name: request.payload.name
      });

      a.save()
      .then(savedAction => {
        return savedAction.sanitizeForResponse();
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
