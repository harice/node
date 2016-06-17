var AppConfig  = require('../../../config');
var Promise    = require('bluebird');
var AWS        = require('aws-sdk');
var Handlebars = require('handlebars');
var fs         = require('fs');
var Boom       = require('boom');
var appRoot    = require('app-root-path');

AWS.config.update(AppConfig.get('/aws/config'));
var SES       = new AWS.SES();

Promise.promisifyAll(SES);

module.exports = function(email, type, template, user, options) {
  var to  = [email];
  var frm = 'do-not-reply@ridepedal.com';

  var rawTemplatePath = appRoot +
          '/server/views/emails/'+ template + '.html';

  var envExtension = '';
  var envs = [
    'dev','staging'
  ]

  if(user && user.host){
    for (var i = 0; i < envs.length; i++) {
      if (user.host.indexOf(envs[i]) > -1) {
        envExtension = '-' + envs[i];
      }
    }
  }

  console.log("-- ENV EXTENSTION: " + envExtension);

  var rawTemplate = '';

  try {
     rawTemplate = fs.readFileSync(rawTemplatePath)
  } catch (e) {
    if(template !== ''){
      throw Boom.notFound("No email template found.");
    }
  }

  var compiledTemplate = Handlebars.compile(rawTemplate.toString());

  var subject = { Data: 'Pedal Test Email' };
  var body = {
    Text: {
      Data: 'Hello from Pedal. This is a test email.'
    }
  };

  switch (type) {

    case 'reset_password':
      var linkToAdmin = 'https://admin'+envExtension+'.ridepedal.com?r='+
                          user.token;

      var html = compiledTemplate({
        firstName : user.first_name,
        resetLink: linkToAdmin
      });

      body = {
        Html: {
          Data: html
        }
      }

      subject = { Data: 'Reset your password' }

      break;
    case 'pedaleremail':
      html = compiledTemplate({
        email : user.email
      });

      body = {
        Html: {
          Data: html
        }
      }

      subject = { Data: 'New pedaler application' }

      break;
    case 'welcome-pedaler':

      body = {
        Html: {
          Data: rawTemplate.toString()
        }
      }

      subject = { Data: 'Thanks For Your Interest in Pedal!' }

      break;
    case 'report':

      subject = { Data: options.type }
      body = options.booking.Rider.first_name+' '+options.booking.Rider.last_name+' - '+options.type;
      body = {
        Text:{
          Data: body
        }
      }

      break;
    default:
      console.log('default message... dont mind me...');
      break;
  }

  return SES.sendEmailAsync({
    Source: frm,
    Destination: { ToAddresses: to },
    Message: {
      Subject: subject,
      Body: body
    }
  });

}
