import * as aws from '@pulumi/aws';

const vpc = (stackName: string) => new aws.ec2.Vpc(
  'VPC',
  {
    cidrBlock: '192.168.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
      Name: `${stackName}/VPC`,
    },
  },
);

const clusterSharedNodeSecurityGroup = (
  stackName: string,
  vpcParam: aws.ec2.Vpc,
) => new aws.ec2.SecurityGroup(
  'ClusterSharedNodeSecurityGroup',
  {
    description: 'Communication between all nodes in the cluster',
    tags: {
      Name: `${stackName}/ClusterSharedNodeSecurityGroup`,
    },
    vpcId: vpcParam.id,
  },
);

export {
  vpc,
  clusterSharedNodeSecurityGroup,
};
