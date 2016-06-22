import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/cards',
  config: {
    tags: ['api', 'cards'],
    description: 'Creates a new card.',
    notes: '1 user has many cards.',
    auth: {
      strategies:['jwt']
    },
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
      payload: {
        creditCardNumber: Joi.string().required(),
        creditCardExpiration: Joi.string().required(),
        creditCardCvv: Joi.string().required(),
        creditCardType: Joi.string().required(),
        creditCardName: Joi.string().required()
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
      const { Card } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;

      Card.build({
        userId: request.auth.credentials.id,
        creditCardNumber: request.payload.creditCardNumber,
        creditCardExpiration: request.payload.creditCardExpiration,
        creditCardCvv: request.payload.creditCardCvv,
        creditCardType: request.payload.creditCardType,
        creditCardName: request.payload.creditCardName
      }).save()
      .then(card => {
        return card;
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply);
      //reply('s')
    }
  }
}
