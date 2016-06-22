import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'PUT',
  path: '/cards/{id}',
  config: {
    tags: ['api', 'cards'],
    description: 'Updates a card of the signed in user',
    notes: 'Updates a card and returns updated object.',
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
      params: {
        id: Joi.number().integer().required()
      },
      payload: {
        creditCardName: Joi.string().optional(),
        creditCardType: Joi.string().optional(),
        creditCardCvv: Joi.string().optional(),
        creditCardExpiration: Joi.string().optional(),
        creditCardNumber: Joi.string().optional()
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

      const { Card } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Card.findOne({
        where:{
          id: request.params.id,
          userId: request.auth.credentials.id
        }
      })
      .then(card => {
        if (card) {
          return card.set({
            creditCardName: request.payload.creditCardName,
            creditCardType: request.payload.creditCardType,
            creditCardCvv: request.payload.creditCardCvv,
            creditCardExpiration: request.payload.creditCardExpiration,
            creditCardNumber: request.payload.creditCardNumber
          }).save();
        }
        throw Boom.notFound('Card not found.')

      })

      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
    }
  }
}
