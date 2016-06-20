'use strict';

import AppConfig from '../../config';
import Joi from 'joi';
import Boom from 'boom';
import validateJWT from './strategies/jwt';

exports.register = (server, options, next) => {

  server.auth.strategy('jwt', 'jwt', true, {
    key: AppConfig.get('/security/jwtSecret'),
    validateFunc: validateJWT,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });

  server.route({
    method: 'POST',
    path: '/auth',
    config: {
      tags: ['api', 'auth'],
      description: 'Authenticate a user',
      notes: 'Takes a user and pass and returns a token for an authenticated user',
      auth: false,
      cors: true,
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '401': {'description': 'Invalid credentials'},
            '500': {'description': 'Internal Server Error'}
          }
        }
      },
      handler(request, reply) {
        const { User } = request.models;
        let _user;

        User.findOne({ where: {email: request.payload.email} })
          .then(foundUser => {
            if (!foundUser) throw Boom.unauthorized('invalid login credentials');
            _user = foundUser;
            return _user.comparePassword(request.payload.password);
          })
          .then(passwordMatches => {
            if (!passwordMatches) throw Boom.unauthorized('invalid login credentials');
            const data = _user.sanitizeForResponse();
            data.token = _user.generateToken();
            return data;
          })
          .asCallback(reply);

      }
    }
  });

  server.route({
    method: 'POST',
    path: '/auth/otp',
    config: {
      tags: ['api', 'auth'],
      description: 'Sends user a code through email or text.',
      notes: 'This will return a 4-digit code if non-existing, else shows User object.',
      auth: false,
      cors: true,
      validate: {
        payload: {
          email: Joi.string().email(),
          phoneNumber: Joi.string()
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '401': {'description': 'Invalid credentials'},
            '500': {'description': 'Internal Server Error'}
          }
        }
      },
      handler(request, reply) {
        const { User } = request.models;
        const { email, phoneNumber } = request.payload;
        const { generateVerifyOTP, sendEmailViaSES } = request.server.plugins.common;

        User.findOne({
          where:{
            $or:{
              email:email,
              phoneNumber: phoneNumber
            }
          }
        })
        .then(user => {
          if(user){
            var code = generateVerifyOTP(user.email);
            if(email){
              sendEmailViaSES({
                email: user.email,
                code: code,
                type: 'otp',
                template: 'otp.html'
              })
            }

            if(phoneNumber){

            }

            return {
              code: code
            }

          }
        })
        .asCallback(reply);

      }
    }
  });

  server.route({
    method: 'POST',
    path: '/auth/resetpassword',
    config: {
      tags: ['api', 'auth'],
      description: 'Sends email to user containing a link to enter new password.',
      notes: 'This will save new reset password request and returns object if success.',
      auth: false,
      cors: true,
      validate: {
        payload: {
          email: Joi.string().email()
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '401': {'description': 'Invalid credentials'},
            '500': {'description': 'Internal Server Error'}
          }
        }
      },
      handler(request, reply) {
        const { User, ResetPasswordRequest } = request.models;
        const { email } = request.payload;
        const { sendEmailViaSES } = request.server.plugins.common;

        User.findOne({
          where:{
            email:email
          }
        })
        .then(user => {
          if(!user){
            throw Boom.notFound('User not found.')
          }
          var token = user.generateToken();
          //async
          sendEmailViaSES({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: 'resetpassword',
            template: 'reset-password.html',
            token: token
          })
          .then(() => {
            console.log('SENT')
          })

          var expirationDate = new Date();
          expirationDate.setMinutes(expirationDate.getMinutes() + 360);

          return ResetPasswordRequest.build({
            userId: user.id,
            token: token,
            expiredAt: expirationDate
          }).save()
        })
        .asCallback(reply);

      }
    }
  });

  next();
}

exports.register.attributes = {
  name: 'auth',
}
