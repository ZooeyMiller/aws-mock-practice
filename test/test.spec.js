const test = require('tape');
const { handler } = require('../js/s3mock');
const AWS = require('aws-sdk-mock');
const sinon = require('sinon');

test('test should run without failing when aws-sdk-mock is used', t => {
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

  handler(mockEmail, null, () => {
    AWS.restore();
    t.pass(
      'checks that the AWS methods are mocked and that this callback is passed through to the end'
    );
    t.end();
  });
});

test('Spy on the putObject arguments', t => {
  AWS.mock('S3', 'getObject', (err, callback) => {
    const buffer = Buffer.from('everything is okay', 'utf8');
    callback(null, { Body: buffer });
  });

  const spy = sinon.spy();
  AWS.mock('S3', 'putObject', spy);

  const mockEmail = {
    Records: [{ ses: { mail: { messageId: 'hello world' } } }],
  };

  const expectedParams = {
    Bucket: 'awesome-dwyl-bucket',
    Key: 'RES.txt',
    Body: 'everything is okay',
  };

  handler(mockEmail, null, () => {});
  AWS.restore();
  t.ok(
    spy.calledWith(expectedParams),
    'putObject is called with the correct params'
  );
  console.log(spy.calledWith('dfsdfds'));
  t.end();
});
