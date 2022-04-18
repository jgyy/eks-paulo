import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

const s3Bucket = new aws.s3.Bucket('my-bucket', {
  website: {
    indexDocument: 'index.html',
  },
});
const bucketObject = new aws.s3.BucketObjectv2('index.html', {
  bucket: s3Bucket.id,
  acl: 'public-read',
  contentType: 'text/html',
  source: new pulumi.asset.FileAsset('index.html'),
});

export default 'eks';
export const bucketName = s3Bucket.id;
export const bucketObjectName = bucketObject.id;
export const bucketEndpoint = pulumi.interpolate`http://${s3Bucket.websiteEndpoint}`;
