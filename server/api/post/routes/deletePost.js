import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'DELETE',
  path: '/posts/{id}',
  config: {
    tags: ['api', 'posts'],
    description: 'Deletes a post',
    notes: 'Deletes a post and returns fail or success.',
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
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
      const { Post } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const authdUser = request.auth.credentials;

      Post.findOne({
        where: {
          id: request.params.id,
          UserId: authdUser.id
        }
      })
        .then(post => {
          if (!post) throw Boom.notFound('No post found.');

          return post.destroy();
        })
        .then(resultPost => {
          return { deletedAt: resultPost.deletedAt };
        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);

    }
  }
}
