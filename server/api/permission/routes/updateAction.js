import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'PUT',
  path: '/actions/{id}',
  config: {
    tags: ['api', 'actions'],
    description: 'Updates a action',
    notes: 'Updates a action.',
    cors: true,
    auth : false,
    validate: {
      params: {
        id: Joi.number().integer().required()
      },
      payload: {
        name: Joi.string().optional()
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

      if (!Object.keys(request.payload).length) throw Boom.badRequest('Your payload is empty.');

      const { Action } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Action.findOne({
        where: {
          id: request.params.id
        }
      })
        .then(action => {
          if (!action) throw Boom.notFound('No action found.');
          return action.set(request.payload).save();

        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);
    }
  }
}
