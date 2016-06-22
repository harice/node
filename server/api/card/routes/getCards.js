import Joi from 'joi';
import Boom from 'boom';

export default {
  method: 'GET',
  path: '/cards',
  config: {
    tags: ['api', 'cards'],
    description: 'Gets all cards info of the user.',
    notes: "Returns array of card object of the signed in user.",
    auth: {
      strategies:['jwt']
    },
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown()
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

      Card.findAll({
        where:{
          userId: request.auth.credentials.id
        }
      })
      .then(card => {
        if(card.length){
          return card;
        }
        throw Boom.notFound('No card found.')
      })
      .asCallback(reply);

    }
  }
}
