import Joi from 'joi';
import Boom from 'boom';

export default {
  method: 'DELETE',
  path: '/cards/{id}',
  config: {
    tags: ['api', 'cards'],
    description: 'Delete a card of the signed in user.',
    notes: "Returns deleted card object of the signed in user.",
    auth: {
      strategies:['jwt']
    },
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
      params:{
        id: Joi.number().integer().required()
      }
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '500': {'description': 'Internal Server Error'}
        }
      }
    },
    handler: (request, reply) => {
      const { Card } = request.models;

      Card.findOne({
        where:{
          id: request.params.id,
          userId: request.auth.credentials.id
        }
      })
      .then(card => {
        if(card){
          return card.destroy()
          .then(card => {
            return {
              deleted: true,
              Card: card
            }
          })
        }
        throw Boom.notFound('Card not found.')
      })
      .asCallback(reply);

    }
  }
}
