import Joi from 'joi';
import Sequelize from 'sequelize';

export default {
  method: 'POST',
  path: '/posts',
  config: {
    tags: ['api', 'posts'],
    description: 'Creates a new post',
    notes: 'Takes a new post information and returns the post info',
    cors: true,
    payload: {
      output: 'stream',
      parse: true,
      maxBytes: 1024 * 1024 * 50,
      allow: 'multipart/form-data'
    },
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
      payload: {
        title: Joi.string().required(),
        description: Joi.string().required(),
        imageFile: Joi.object({ pipe: Joi.func().required() }).unknown().required()
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
      const { Post } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const { streamFileToS3 } = request.server.plugins.common;
      const authdUser = request.auth.credentials;

      streamFileToS3("posts", request.payload.imageFile)
        .then(res => {
          const p = Post.build({
            UserId: authdUser.id,
            title: request.payload.title,
            description: request.payload.description,
            imageUrl: res.key
          });

          return p.save();
        })
        .then(savedPost => {
          return savedPost.sanitizeForResponse();
        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);

    }
  }
}
