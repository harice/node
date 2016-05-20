import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';
import _ from 'lodash';

export default {
  method: 'GET',
  path: '/posts',
  config: {
    tags: ['api', 'posts'],
    description: 'Gets a list of posts',
    notes: "Returns all the posts",
    auth: false,
    cors: true,
    validate: {
      query: {
        search: Joi.string().default('').optional(),
        asc: Joi.boolean().default(true),
        limit: Joi.number().integer().min(1).default(25),
        offset: Joi.number().integer().default(0)
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
      const order = (request.query.asc) ? 'asc' : 'desc';

      const sanitizeForResponse = function(n) {
        if (n.PostLike && n.PostLike.length) {
          n.PostLike = _.map(n.PostLike, sanitizeForResponse);
        }

        return n.sanitizeForResponse();
      };

      Post.hasMany(PostLike, { foreignKey: 'PostId', as: 'PostLike' });

      Post.findAndCountAll({
        include: [
          {
            model: PostLike,
            as: 'PostLike',
            required: false
          }
        ],
        where: {
          title: {
            $iLike: '%' + request.query.search + '%'
          }
        },
        offset: request.query.offset,
        limit: request.query.limit,
        order: [
          ['createdAt', order]
        ]
      })
        .then(postResult => {
          if (postResult.count) {
            postResult.rows = _.map(postResult.rows, sanitizeForResponse);

            return postResult;
          }

          throw Boom.notFound('No posts found.');
        })
        .catch(Sequelize.ValidationError, convertValidationErrors)
        .asCallback(reply);
    }
  }
}
