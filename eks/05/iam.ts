import * as aws from '@pulumi/aws';
import Parameters from './param';

class IAM extends Parameters {
  policyAutoScaling: aws.iam.Policy | null = null;

  policyCloudWatchMetrics: aws.iam.Policy | null = null;

  policyELBPermissions: aws.iam.Policy | null = null;

  NodeInstanceRole = () => {
    if (this.policyAutoScaling) {
      return new aws.iam.Role(
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
            this.AmazonEC2ContainerRegistryReadOnly,
            this.AmazonEKSWorkerNodePolicy,
            this.AmazonEKSCNIPolicy,
            this.AmazonSSMManagedInstanceCore,
            this.policyAutoScaling.arn,
          ],
          path: '/',
          tags: { Name: `${this.StackName}/NodeInstanceRole` },
        },
      );
    }
    throw new Error(`policyAutoScaling = ${this.policyAutoScaling}`);
  };

  PolicyAutoScaling = () => {
    this.policyAutoScaling = new aws.iam.Policy(
      'PolicyAutoScaling',
      {
        policy: JSON.stringify({
          Statement: [{
            Action: [
              'autoscaling:DescribeAutoScalingGroups',
              'autoscaling:DescribeAutoScalingInstances',
              'autoscaling:DescribeLaunchConfigurations',
              'autoscaling:DescribeTags',
              'autoscaling:SetDesiredCapacity',
              'autoscaling:TerminateInstanceInAutoScalingGroup',
              'ec2:DescribeInstanceTypes',
              'ec2:DescribeLaunchTemplateVersions',
            ],
            Effect: 'Allow',
            Resource: '*',
          }],
          Version: '2012-10-17',
        }),
        name: `${this.StackName}-PolicyAutoScaling`,
      },
    );
    return this.policyAutoScaling;
  };

  PolicyCloudWatchMetrics = () => {
    this.policyCloudWatchMetrics = new aws.iam.Policy(
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
        name: `${this.StackName}-PolicyCloudWatchMetrics`,
      },
    );
    return this.policyCloudWatchMetrics;
  };

  PolicyELBPermissions = () => {
    this.policyELBPermissions = new aws.iam.Policy(
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
        name: `${this.StackName}-PolicyELBPermissions`,
      },
    );
    return this.policyELBPermissions;
  };

  ServiceRole = () => {
    if (this.policyCloudWatchMetrics && this.policyELBPermissions) {
      return new aws.iam.Role(
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
            this.AmazonEKSClusterPolicy,
            this.AmazonEKSVPCResourceController,
            this.policyCloudWatchMetrics.arn,
            this.policyELBPermissions.arn,
          ],
          tags: { Name: `${this.StackName}/ServiceRole` },
        },
      );
    }
    throw new Error(`
    policyCloudWatchMetrics = ${this.policyCloudWatchMetrics}
    policyELBPermissions = ${this.policyELBPermissions}
    `);
  };
}

export default IAM;
