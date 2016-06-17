import AWS from 'aws-sdk';
import AppConfig from '../../config';
import Promise from 'bluebird';

const { S3 } = AWS;

AWS.config.update(AppConfig.get('/aws'));

export default function(key) {
  return new Promise((resolve, reject) => {
    const s3 = new S3();

    const params = {
      Bucket: AppConfig.get('/media/bucket'), /* required */
      Key: key, /* required */
    };

    s3.deleteObject(params)
      .send((err, data) => {
        if (err) {
          console.log("An error occurred", err);
          return reject(err);
        }

        return resolve({
          data: data
        });
    });

  })
}
