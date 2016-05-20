import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';

export default {
  method: 'POST',
  path: '/posts/{id}/like',
  config: {
    tags: ['api', 'posts'],
    description: 'Likes a post',
    notes: 'Likes a post and returns fail or success.',
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
      const { PostLike } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const authdUser = request.auth.credentials;

      let tmpPost;

      Post.findById(request.params.id)
        .then(post => {
          if (!post) throw Boom.notFound('No post found.');

          tmpPost = post;
          return PostLike.findOne({
            where: {
              UserId: authdUser.id,
              PostId: post.id
            }
          });
        })
        .then(postLike => {
          if (postLike) return postLike.destroy();

          const p = PostLike.build({
            UserId: authdUser.id,
            PostId: tmpPost.id
          });

          return p.save();
        })
        .then(resultPostLike => {
          return { deletedAt: resultPostLike.deletedAt };
        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);

    }
  }
}
