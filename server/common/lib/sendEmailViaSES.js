import AppConfig from '../../config';
import Promise from 'bluebird';
import AWS from 'aws-sdk';
import fs from 'fs';
import appRoot from 'app-root-path';
import Boom from 'boom';
import Handlebars from 'handlebars';

AWS.config.update(AppConfig.get('/aws'));
var SES       = new AWS.SES();

Promise.promisifyAll(SES);

export default function(params) {
  var to  = [params.email];
  var frm = params.email;
  var compiledTemplate;

  if(params.template){

    var rawTemplatePath = appRoot +
            '/server/emailTemplates/'+ params.template;

    var rawTemplate = '';
    try {
       rawTemplate = fs.readFileSync(rawTemplatePath)
    } catch (e) {
      if(params.template !== ''){
        throw Boom.notFound("No email template found.");
      }
    }

    compiledTemplate = Handlebars.compile(rawTemplate.toString());
  }

  var subject = { Data: 'Pedal Test Email' };
  var body = {
    Text: {
      Data: 'Hello from Pedal. This is a test email.'
    }
  };

  switch (params.type) {

    case 'resetpassword':

      var link = 'http://localhost:8069/r='+params.token;

      var html = compiledTemplate({
        firstName: params.firstName,
        lastName: params.lastName,
        link: link
      });

      body = {
        Html: {
          Data: html
        }
      }

      subject = { Data: 'Reset your password' }

      break;
    case 'otp':
      html = compiledTemplate({
        code: params.code
      });

      body = {
        Html: {
          Data: html
        }
      }

      subject = { Data: 'One-time-password' }
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
