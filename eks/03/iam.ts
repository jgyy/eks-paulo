import * as aws from '@pulumi/aws';
import Parameters from './param';

class IAM extends Parameters {
  policyCloudWatchMetrics: aws.iam.Policy | null = null;

  policyELBPermissions: aws.iam.Policy | null = null;

  NodeInstanceRole = () => new aws.iam.Role(
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
      ],
      path: '/',
      tags: { Name: `${this.StackName}/NodeInstanceRole` },
    },
  );

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
