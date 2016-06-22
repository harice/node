import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'GET',
  path: '/users/me',
  config: {
    tags: ['api', 'users'],
    description: 'Gets a users info',
    notes: "Returns the authenticated user's details",
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '500': {'description': 'Internal Server Error'}
        }
      }
    },
    handler: (request, reply) => {
      const authdUser = request.auth.credentials;
      const { convertValidationErrors } = request.server.plugins.common;
      const { User, Card } = request.models;

      User.hasMany(Card,{
        foreignKey: 'userId',
        as: 'Cards'
      })

      User.findOne({
        include:[
          {
            model: Card,
            as: 'Cards',
            reqired: false
          }
        ],
        where:{
          id: authdUser.id
        }
      })
      .then(user => {
        if(user){
          return user.sanitizeForResponse();
        }
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .asCallback(reply)
    }
  }
}
