import * as aws from '@pulumi/aws';
import Parameters from './param';

class IAM extends Parameters {
  NodeInstanceProfile = () => {
    this.CheckCreated('nodeInstanceRole');
    return new aws.iam.InstanceProfile(
      'NodeInstanceProfile',
      { role: this.nodeInstanceRole },
    );
  };

  NodeInstanceRole = () => {
    this.CheckCreated(
      'policyAutoScaling',
      'policyEBS',
      'policyEFS',
      'policyEFSEC2',
      'policyFSX',
      'policyServiceLinkRole',
    );
    this.nodeInstanceRole = new aws.iam.Role(
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
          this.AmazonEC2ContainerRegistryReadOnly(),
          this.AmazonEKSWorkerNodePolicy(),
          this.AmazonEKSCNIPolicy(),
          this.AmazonSSMManagedInstanceCore(),
          this.policyAutoScaling.arn,
          this.policyEBS.arn,
          this.policyEFS.arn,
          this.policyEFSEC2.arn,
          this.policyFSX.arn,
          this.policyServiceLinkRole.arn,
        ],
        path: '/',
        tags: { Name: `${this.StackName}/NodeInstanceRole` },
      },
    );
    return this.nodeInstanceRole;
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

  PolicyEBS = () => {
    this.policyEBS = new aws.iam.Policy(
      'PolicyEBS',
      {
        policy: JSON.stringify({
          Statement: [
            {
              Action: [
                'ec2:CreateSnapshot',
                'ec2:AttachVolume',
                'ec2:DetachVolume',
                'ec2:ModifyVolume',
                'ec2:DescribeAvailabilityZones',
                'ec2:DescribeInstances',
                'ec2:DescribeSnapshots',
                'ec2:DescribeTags',
                'ec2:DescribeVolumes',
                'ec2:DescribeVolumesModifications',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:CreateTags'],
              Condition: {
                StringEquals: {
                  'ec2:CreateAction': [
                    'CreateVolume',
                    'CreateSnapshot',
                  ],
                },
              },
              Effect: 'Allow',
              Resource: [
                'arn:aws:ec2:*:*:volume/*',
                'arn:aws:ec2:*:*:snapshot/*',
              ],
            },
            {
              Action: ['ec2:DeleteTags'],
              Effect: 'Allow',
              Resource: [
                'arn:aws:ec2:*:*:volume/*',
                'arn:aws:ec2:*:*:snapshot/*',
              ],
            },
            {
              Action: ['ec2:CreateVolume'],
              Condition: {
                StringLike: { 'aws:RequestTag/ebs.csi.aws.com/cluster': 'true' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:CreateVolume'],
              Condition: {
                StringLike: { 'aws:RequestTag/CSIVolumeName': '*' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:CreateVolume'],
              Condition: {
                StringLike: { 'aws:RequestTag/kubernetes.io/cluster/*': 'owned' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:DeleteVolume'],
              Condition: {
                StringLike: { 'ec2:ResourceTag/ebs.csi.aws.com/cluster': 'true' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:DeleteVolume'],
              Condition: {
                StringLike: { 'ec2:ResourceTag/CSIVolumeName': '*' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:DeleteVolume'],
              Condition: {
                StringLike: { 'ec2:ResourceTag/kubernetes.io/cluster/*': 'owned' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:DeleteSnapshot'],
              Condition: {
                StringLike: { 'ec2:ResourceTag/CSIVolumeSnapshotName': '*' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: ['ec2:DeleteSnapshot'],
              Condition: {
                StringLike: { 'ec2:ResourceTag/ebs.csi.aws.com/cluster': 'true' },
              },
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        }),
        name: `${this.StackName}-PolicyEBS`,
      },
    );
    return this.policyEBS;
  };

  PolicyEFS = () => {
    this.policyEFS = new aws.iam.Policy(
      'PolicyEFS',
      {
        policy: JSON.stringify({
          Statement: [
            {
              Action: ['elasticfilesystem:*'],
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        }),
        name: `${this.StackName}-PolicyEFS`,
      },
    );
    return this.policyEFS;
  };

  PolicyEFSEC2 = () => {
    this.policyEFSEC2 = new aws.iam.Policy(
      'PolicyEFSEC2',
      {
        policy: JSON.stringify({
          Statement: [
            {
              Action: [
                'ec2:DescribeSubnets',
                'ec2:CreateNetworkInterface',
                'ec2:DescribeNetworkInterfaces',
                'ec2:DeleteNetworkInterface',
                'ec2:ModifyNetworkInterfaceAttribute',
                'ec2:DescribeNetworkInterfaceAttribute',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        }),
        name: `${this.StackName}-PolicyEFSEC2`,
      },
    );
    return this.policyEFSEC2;
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

  PolicyFSX = () => {
    this.policyFSX = new aws.iam.Policy(
      'PolicyFSX',
      {
        policy: JSON.stringify({
          Statement: [{
            Action: ['fsx:*'],
            Effect: 'Allow',
            Resource: '*',
          }],
          Version: '2012-10-17',
        }),
        name: `${this.StackName}-PolicyFSX`,
      },
    );
    return this.policyFSX;
  };

  PolicyServiceLinkRole = () => {
    this.policyServiceLinkRole = new aws.iam.Policy(
      'PolicyServiceLinkRole',
      {
        policy: JSON.stringify({
          Statement: [{
            Action: [
              'iam:CreateServiceLinkedRole',
              'iam:AttachRolePolicy',
              'iam:PutRolePolicy',
            ],
            Effect: 'Allow',
            Resource: '*',
          }],
          Version: '2012-10-17',
        }),
        name: `${this.StackName}-PolicyServiceLinkRole`,
      },
    );
    return this.policyServiceLinkRole;
  };

  ServiceRole = () => {
    this.CheckCreated('policyCloudWatchMetrics', 'policyELBPermissions');
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
          this.AmazonEKSClusterPolicy(),
          this.AmazonEKSVPCResourceController(),
          this.policyCloudWatchMetrics.arn,
          this.policyELBPermissions.arn,
        ],
        tags: { Name: `${this.StackName}/ServiceRole` },
      },
    );
  };
}

export default IAM;
