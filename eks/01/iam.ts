import * as aws from '@pulumi/aws';

const Policy = (StackName: string) => (
  {
    PolicyCloudWatchMetrics: new aws.iam.Policy(
      'PolicyCloudWatchMetrics',
      {
        policy: JSON.stringify({
          Statement: [{
            Action: ['cloudwatch:PutMetricData'],
            Effect: 'Allow',
            Resource: '*',
          }],
          Version: '2012-10-17',
        }),
        name: `${StackName}-PolicyCloudWatchMetrics`,
      },
    ),
    PolicyELBPermissions: new aws.iam.Policy(
      'PolicyELBPermissions',
      {
        policy: JSON.stringify({
          Statement: [{
            Action: [
              'ec2:DescribeAccountAttributes',
              'ec2:DescribeAddresses',
              'ec2:DescribeInternetGateways',
            ],
            Effect: 'Allow',
            Resource: '*',
          }],
          Version: '2012-10-17',
        }),
        name: `${StackName}-PolicyELBPermissions`,
      },
    ),
  }
);

const Role = (
  StackName: string,
  AmazonEKSClusterPolicy: Promise<aws.iam.GetPolicyResult>,
  AmazonEKSVPCResourceController: Promise<aws.iam.GetPolicyResult>,
  AmazonEC2ContainerRegistryReadOnly: Promise<aws.iam.GetPolicyResult>,
  AmazonEKSWorkerNodePolicy: Promise<aws.iam.GetPolicyResult>,
  AmazonEKSCNIPolicy: Promise<aws.iam.GetPolicyResult>,
  AmazonSSMManagedInstanceCore: Promise<aws.iam.GetPolicyResult>,
  PolicyCloudWatchMetrics: aws.iam.Policy,
  PolicyELBPermissions: aws.iam.Policy,
) => (
  {
    ServiceRole: new aws.iam.Role(
      'ServiceRole',
      {
        assumeRolePolicy: JSON.stringify({
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'eks.amazonaws.com' },
          }],
          Version: '2012-10-17',
        }),
        managedPolicyArns: [
          AmazonEKSClusterPolicy.then((p) => p.arn),
          AmazonEKSVPCResourceController.then((p) => p.arn),
          PolicyCloudWatchMetrics.arn,
          PolicyELBPermissions.arn,
        ],
        tags: { Name: `${StackName}/ServiceRole` },
      },
    ),
    NodeInstanceRole: new aws.iam.Role(
      'NodeInstanceRole',
      {
        assumeRolePolicy: JSON.stringify({
          Statement: [{
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'ec2.amazonaws.com' },
          }],
          Version: '2012-10-17',
        }),
        managedPolicyArns: [
          AmazonEC2ContainerRegistryReadOnly.then((p) => p.arn),
          AmazonEKSWorkerNodePolicy.then((p) => p.arn),
          AmazonEKSCNIPolicy.then((p) => p.arn),
          AmazonSSMManagedInstanceCore.then((p) => p.arn),
        ],
        path: '/',
        tags: { Name: `${StackName}/NodeInstanceRole` },
      },
    ),
  }
);

export {
  Policy,
  Role,
};
