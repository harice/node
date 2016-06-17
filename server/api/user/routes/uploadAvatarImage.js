import Joi from 'joi';
import Sequelize from 'sequelize';
import Boom from 'boom';
import AppConfig from '../../../config';
import sharp from 'sharp';

export default {
  method: 'PUT',
  path: '/users/uploadAvatarImage/{id}',
  config: {
    tags: ['api', 'users', 'avatar image'],
    description: 'Upload an avatar image',
    notes: 'Uploads avatar images and returns fail or success.',
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
      params: {
        id: Joi.number().integer().required()
      },
      payload: {
        resizeHeight: Joi.number().integer().optional(),
        resizeWidth: Joi.number().integer().optional(),
        cropLeft: Joi.number().integer().required(),
        cropTop: Joi.number().integer().required(),
        cropWidth: Joi.number().integer().required(),
        cropHeight: Joi.number().integer().required(),
        avatarImageFile: Joi.object({ pipe: Joi.func().required() }).unknown().required()
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

      const { User } = request.models;
      const { convertValidationErrors } = request.server.plugins.common;
      const { streamFileToS3v2 } = request.server.plugins.common;
      const { deleteFileToS3 } = request.server.plugins.common;
      const authdUser = request.auth.credentials;
      const cropLeft = request.payload.cropLeft;
      const cropTop = request.payload.cropTop;
      const cropWidth = request.payload.cropWidth;
      const cropHeight = request.payload.cropHeight;
      const avatarResizeDimensionHeight = request.payload.resizeHeight || AppConfig.get('/avatarImageDefaultDimension/height');
      const avatarResizeDimensionWidth = request.payload.resizeWidth || AppConfig.get('/avatarImageDefaultDimension/width');
      let useObj = {};
      let img = {};

      User.findOne({
        where: {
          id: request.params.id
        }
      })
      .then(user => {
          if (!user) throw Boom.notFound('No user found.');

          //cropping and resizing the avatar image and buffer it
          img = request.payload.avatarImageFile;
          useObj = user;

          return sharp(img._data)
                    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
                    .resize(avatarResizeDimensionWidth, avatarResizeDimensionHeight)
                    .toBuffer();

      })
      .then(bufferedImage => {
        //uploading new avatar image to s3
        return streamFileToS3v2("avatars",img.hapi.filename, img.hapi.headers['content-type'], bufferedImage);
      })
      .then(res => {
        //remove old avatar file to s3
        let deletingResult = deleteFileToS3(useObj.avatarImageUrl);

        // update avatar url from user table
        return useObj.update({avatarImageUrl: res.key});
      })
      .catch(Sequelize.ValidationError, convertValidationErrors)
      .catch(function(err){
        throw Boom.expectationFailed(err.message)
      })
      .asCallback(reply);
    }
  }
}
