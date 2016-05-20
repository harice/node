import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';
import _ from 'lodash';

export default {
  method: 'PUT',
  path: '/posts/{id}',
  config: {
    tags: ['api', 'posts'],
    description: 'Updates a post',
    notes: 'Updates a post and returns fail or success.',
    cors: true,
    validate: {
      headers: Joi.object({
       'authorization': Joi.string().required()
      }).unknown(),
      params: {
        id: Joi.number().integer().required()
      },
      payload: {
        title: Joi.string().optional(),
        description: Joi.string().optional()
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

      const { Post } = request.models;
      const { PostLike } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const authdUser = request.auth.credentials;

      Post.hasMany(PostLike, { foreignKey: 'PostId', as: 'PostLike' });

      Post.findOne({
        include: [
          {
            model: PostLike,
            as: 'PostLike',
            required: false
          }
        ],
        where: {
          id: request.params.id,
          UserId: authdUser.id
        }
      })
        .then(post => {
          if (!post) throw Boom.notFound('No post found.');
          
          return post.set(request.payload).save();
        })
        .then(updatedPost => {
          if (updatedPost.PostLike.length) {
            updatedPost.PostLike = _.map(updatedPost.PostLike, function(n) {
              return n.sanitizeForResponse();
            });
          }

          return updatedPost.sanitizeForResponse();
        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);
    }
  }
}
