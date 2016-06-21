// import Joi from 'joi';
// import Sequelize from 'sequelize';
// import Boom from 'boom';
// import AppConfig from '../../../config';
// import sharp from 'sharp';
//
// export default {
//   method: 'POST',
//   path: '/file/image',
//   config: {
//     tags: ['api', 'file', 'upload image'],
//     description: 'Upload an image file',
//     notes: 'Uploads images file and returns id if sucess or fail.',
//     cors: true,
//     payload: {
//       output: 'stream',
//       parse: true,
//       maxBytes: 1024 * 1024 * 50,
//       allow: 'multipart/form-data'
//     },
//     validate: {
//       headers: Joi.object({
//        'authorization': Joi.string().required()
//       }).unknown(),
//       payload: {
//         resizeHeight: Joi.number().integer().optional(),
//         resizeWidth: Joi.number().integer().optional(),
//         imageFile: Joi.object({ pipe: Joi.func().required() }).unknown().required()
//       }
//     },
//     plugins: {
//       'hapi-swagger': {
//         responses: {
//           '400': {'description': 'Validation error'},
//           '500': {'description': 'Internal Server Error'}
//         }
//       }
//     },
//     handler: (request, reply) => {
//       if (!Object.keys(request.payload).length) throw Boom.badRequest('Your payload is empty.');
//
//       const { Image } = request.models;
//       const { convertValidationErrors } = request.server.plugins.common;
//       const { streamFileToS3v2 } = request.server.plugins.common;
//       const { deleteFileToS3 } = request.server.plugins.common;
//       const authdUser = request.auth.credentials;
//       const resizeDimensionHeight = request.payload.resizeHeight || AppConfig.get('/fileUpload/defaultImageResolution/height');
//       const resizeDimensionWidth = request.payload.resizeWidth || AppConfig.get('/fileUpload/defaultImageResolution/width');
//       let img = {};
//
//       img = request.payload.imageFile;
//       console.log(img);
//       sharp(img._data)
//       .resize(resizeDimensionWidth, resizeDimensionHeight)
//       .toBuffer()
//       .then(bufferedImage => {
//         //uploading image to s3
//         return streamFileToS3v2("images", img.hapi.filename, img.hapi.headers['content-type'], bufferedImage);
//       })
//       .then(result => {
//         console.log(result);
//         const imgObj = Image.build({
//           url: result.key,
//           dimensionHeight: '500test',
//           dimensionWidth: '500test',
//           filesize: '1mbTest',
//           filetype: 'jpeg',
//         });
//
//         return imgObj.save();
//       })
//       .then(savedImage => {
//         return savedImage.sanitizeForResponse();
//       })
//       .catch(Sequelize.ValidationError, convertValidationErrors)
//       .catch(function(err){
//         throw Boom.expectationFailed(err.message)
//       })
//       .asCallback(reply);
//     }
//   }
// }
