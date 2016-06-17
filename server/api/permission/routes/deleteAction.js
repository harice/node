import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'DELETE',
  path: '/actions/{id}',
  config: {
    tags: ['api', 'actions'],
    description: 'Deletes an action',
    notes: 'Deletes action and returns fail or success.',
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
      const { Action } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Action.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(action => {
        if (!action) throw Boom.notFound('No action found.');

        return action.destroy();
      })
      .then(resultAction => {
        return { deletedAt: resultAction.deletedAt };
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);

    }
  }
}
