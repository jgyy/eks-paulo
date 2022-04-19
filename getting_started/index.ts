import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { bucketObjectName } from './test';

const s3Bucket = new aws.s3.Bucket('my-bucket', {
  website: {
    indexDocument: 'index.html',
  },
});

export const bucketName = s3Bucket.id;
export const bucketObject = bucketObjectName(s3Bucket).id;
export const bucketEndpoint = pulumi.interpolate`http://${s3Bucket.websiteEndpoint}`;
