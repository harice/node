import Joi from 'joi';
import Boom from 'boom';

export default {
  method: 'GET',
  path: '/cards/{id}',
  config: {
    tags: ['api', 'cards'],
    description: 'Gets a single card\'s info',
    notes: "Returns card object of the signed in user.",
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
          return card;
        }
        throw Boom.notFound('Card not found.')
      })
      .asCallback(reply);

    }
  }
}
