import * as aws from '@pulumi/aws';
import Parameters from './param';
import Resources from './resource';

class IAM extends Parameters {
  constructor(resource: Resources) {
    super();
    this.resource = resource;
  }

  NodeInstanceProfile = () => {
    this.CheckCreated('nodeInstanceRole');
    this.resource.nodeInstanceProfile = new aws.iam.InstanceProfile(
      'NodeInstanceProfile',
      { role: this.resource.nodeInstanceRole },
    );
    return this.resource.nodeInstanceProfile;
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
    this.resource.nodeInstanceRole = new aws.iam.Role(
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
          this.resource.policyAutoScaling.arn,
          this.resource.policyEBS.arn,
          this.resource.policyEFS.arn,
          this.resource.policyEFSEC2.arn,
          this.resource.policyFSX.arn,
          this.resource.policyServiceLinkRole.arn,
        ],
        path: '/',
        tags: { Name: `${this.StackName}/NodeInstanceRole` },
      },
    );
    return this.resource.nodeInstanceRole;
  };

  PolicyAutoScaling = () => {
    this.resource.policyAutoScaling = new aws.iam.Policy(
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
    return this.resource.policyAutoScaling;
  };

  PolicyCloudWatchMetrics = () => {
    this.resource.policyCloudWatchMetrics = new aws.iam.Policy(
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
    return this.resource.policyCloudWatchMetrics;
  };

  PolicyEBS = () => {
    this.resource.policyEBS = new aws.iam.Policy(
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
    return this.resource.policyEBS;
  };

  PolicyEFS = () => {
    this.resource.policyEFS = new aws.iam.Policy(
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
    return this.resource.policyEFS;
  };

  PolicyEFSEC2 = () => {
    this.resource.policyEFSEC2 = new aws.iam.Policy(
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
    return this.resource.policyEFSEC2;
  };

  PolicyELBPermissions = () => {
    this.resource.policyELBPermissions = new aws.iam.Policy(
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
    return this.resource.policyELBPermissions;
  };

  PolicyFSX = () => {
    this.resource.policyFSX = new aws.iam.Policy(
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
    return this.resource.policyFSX;
  };

  PolicyServiceLinkRole = () => {
    this.resource.policyServiceLinkRole = new aws.iam.Policy(
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
    return this.resource.policyServiceLinkRole;
  };

  ServiceRole = () => {
    this.CheckCreated('policyCloudWatchMetrics', 'policyELBPermissions');
    this.resource.serviceRole = new aws.iam.Role(
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
          this.resource.policyCloudWatchMetrics.arn,
          this.resource.policyELBPermissions.arn,
        ],
        tags: { Name: `${this.StackName}/ServiceRole` },
      },
    );
    return this.resource.serviceRole;
  };
}

export default IAM;
