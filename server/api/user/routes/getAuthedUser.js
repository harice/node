import Joi from 'joi';

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
      reply(authdUser.sanitizeForResponse());
    }
  }
}
