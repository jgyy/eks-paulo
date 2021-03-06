import * as aws from '@pulumi/aws';
import Parameter from './param';

class CF extends Parameter {
  CIDR = () => {
    this.CheckCreated('vpc');
    return new aws.cloudformation.Stack(
      'CIDR',
      {
        parameters: {
          IPV4CIDR: this.vpc.cidrBlock,
          IPV6CIDR: this.vpc.ipv6CidrBlock,
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
  };
}

export default CF;
