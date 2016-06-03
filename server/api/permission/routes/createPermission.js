import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/permissions',
  config: {
    tags: ['api', 'permissions'],
    description: 'Creates a new permissions',
    notes: 'Takes a new permissions information.',
    auth: false,
    cors: true,
    validate: {
      payload: {
        role: Joi.number().integer().required(),
        //resource : Joi.object();
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
        console.log(request.payload);
    }
  }
}
