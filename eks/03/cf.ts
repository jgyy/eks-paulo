import * as aws from '@pulumi/aws';
import Parameter from './param';
import Resources from './resource';

class CF extends Parameter {
  constructor(resource: Resources) {
    super();
    this.resource = resource;
  }

  CIDR = () => {
    this.CheckCreated('vpc');
    this.resource.cidr = new aws.cloudformation.Stack(
      'CIDR',
      {
        parameters: {
          IPV4CIDR: this.resource.vpc.cidrBlock,
          IPV6CIDR: this.resource.vpc.ipv6CidrBlock,
        },
        templateBody: JSON.stringify({
          AWSTemplateFormatVersion: '2010-09-09',
          Parameters: {
            IPV4CIDR: { Type: 'String' },
            IPV6CIDR: { Type: 'String' },
          },
          Resources: {
            Bucket: { Type: 'AWS::S3::Bucket' },
          },
          Outputs: {
            IPV40: {
              Value: {
                'Fn::Select': [0, { 'Fn::Cidr': [{ Ref: 'IPV4CIDR' }, 8, 13] }],
              },
            },
            IPV41: {
              Value: {
                'Fn::Select': [1, { 'Fn::Cidr': [{ Ref: 'IPV4CIDR' }, 8, 13] }],
              },
            },
            IPV42: {
              Value: {
                'Fn::Select': [2, { 'Fn::Cidr': [{ Ref: 'IPV4CIDR' }, 8, 13] }],
              },
            },
            IPV43: {
              Value: {
                'Fn::Select': [3, { 'Fn::Cidr': [{ Ref: 'IPV4CIDR' }, 8, 13] }],
              },
            },
            IPV44: {
              Value: {
                'Fn::Select': [4, { 'Fn::Cidr': [{ Ref: 'IPV4CIDR' }, 8, 13] }],
              },
            },
            IPV45: {
              Value: {
                'Fn::Select': [5, { 'Fn::Cidr': [{ Ref: 'IPV4CIDR' }, 8, 13] }],
              },
            },
            IPV60: {
              Value: {
                'Fn::Select': [0, { 'Fn::Cidr': [{ Ref: 'IPV6CIDR' }, 8, 64] }],
              },
            },
            IPV61: {
              Value: {
                'Fn::Select': [1, { 'Fn::Cidr': [{ Ref: 'IPV6CIDR' }, 8, 64] }],
              },
            },
            IPV62: {
              Value: {
                'Fn::Select': [2, { 'Fn::Cidr': [{ Ref: 'IPV6CIDR' }, 8, 64] }],
              },
            },
            IPV63: {
              Value: {
                'Fn::Select': [3, { 'Fn::Cidr': [{ Ref: 'IPV6CIDR' }, 8, 64] }],
              },
            },
            IPV64: {
              Value: {
                'Fn::Select': [4, { 'Fn::Cidr': [{ Ref: 'IPV6CIDR' }, 8, 64] }],
              },
            },
            IPV65: {
              Value: {
                'Fn::Select': [5, { 'Fn::Cidr': [{ Ref: 'IPV6CIDR' }, 8, 64] }],
              },
            },
          },
        }),
      },
    );
    return this.resource.cidr;
  };
}

export default CF;
