import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

const bucketObject = (bucket: aws.s3.Bucket) => new aws.s3.BucketObjectv2('index.html', {
  bucket: bucket.id,
  acl: 'public-read',
  contentType: 'text/html',
  source: new pulumi.asset.FileAsset('index.html'),
});

export default 'test.ts';
export const bucketObjectName = bucketObject;
