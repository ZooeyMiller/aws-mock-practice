const test = require('tape');
const { handler } = require('../js/s3mock');
const AWS = require('aws-sdk-mock');

AWS.mock('S3', 'getObject', (err, callback) => {
  const buffer = Buffer.from('everything is okay', 'utf8');
  callback(null, { Body: buffer });
});

AWS.mock('S3', 'putObject', (err, callback) => {
  callback(null, 'i am working');
});

const mockEmail = {
  Records: [{ ses: { mail: { messageId: 'hello world' } } }],
};

test('test should run without failing when aws-sdk-mock is used', t => {
  handler(mockEmail, null, () => {
    t.pass(
      'checks that the AWS methods are mocked and that this callback is passed through to the end'
    );
    t.end();
  });
});
