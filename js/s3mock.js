//We're more or less just replicating the function that we used when saving an
//email to S3 as we know that works when it's _actually_ on AWS lambada
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  var s3 = new AWS.S3({
    signatureVersion: 'v4',
  });
  s3.getObject(
    {
      Bucket: 'awesome-dwyl-bucket',
      Key: 'hello/' + event.Records[0].ses.mail.messageId,
    },
    (err, res) => {
      const params = {
        Bucket: 'awesome-dwyl-bucket',
        Key: 'RES.txt',
        Body: res.Body.toString(),
      };

      s3.putObject(params, (err, res) => {
        console.log(err, res);
        callback(null, 'Hello from Lambda');
      });
    }
  );
};
