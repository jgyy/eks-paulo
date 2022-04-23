import * as aws from '@pulumi/aws';

const Cluster = (
  StackName: string,
  ControlPlaneSecurityGroup: aws.ec2.SecurityGroup,
  SubnetPublicAPSOUTHEAST1C: aws.ec2.Subnet,
  SubnetPublicAPSOUTHEAST1B: aws.ec2.Subnet,
  SubnetPublicAPSOUTHEAST1A: aws.ec2.Subnet,
  SubnetPrivateAPSOUTHEAST1C: aws.ec2.Subnet,
  SubnetPrivateAPSOUTHEAST1B: aws.ec2.Subnet,
  SubnetPrivateAPSOUTHEAST1A: aws.ec2.Subnet,
  ServiceRole: aws.iam.Role,
) => (
  {
    ControlPlane: new aws.eks.Cluster(
      'cluster-1',
      {
        kubernetesNetworkConfig: {},
        enabledClusterLogTypes: [
          'audit',
          'authenticator',
          'controllerManager',
        ],
        name: StackName,
        vpcConfig: {
          endpointPrivateAccess: false,
          endpointPublicAccess: true,
          securityGroupIds: [
            ControlPlaneSecurityGroup.id,
          ],
          subnetIds: [
            SubnetPublicAPSOUTHEAST1C.id,
            SubnetPublicAPSOUTHEAST1B.id,
            SubnetPublicAPSOUTHEAST1A.id,
            SubnetPrivateAPSOUTHEAST1C.id,
            SubnetPrivateAPSOUTHEAST1B.id,
            SubnetPrivateAPSOUTHEAST1A.id,
          ],
        },
        roleArn: ServiceRole.arn,
        tags: {
          Name: `${StackName}/cluster-1`,
        },
        version: '1.22',
      },
    ),
  }
);

const NodeGroup = (
  ControlPlane: aws.eks.Cluster,
  NodeInstanceRole: aws.iam.Role,
  SubnetPrivateAPSOUTHEAST1A: aws.ec2.Subnet,
  SubnetPrivateAPSOUTHEAST1B: aws.ec2.Subnet,
  SubnetPrivateAPSOUTHEAST1C: aws.ec2.Subnet,
) => (
  {
    NodeGroup: new aws.eks.NodeGroup(
      'ng-1',
      {
        nodeGroupName: 'ng-1',
        instanceTypes: ['m5.large'],
        clusterName: ControlPlane.name,
        nodeRoleArn: NodeInstanceRole.arn,
        subnetIds: [
          SubnetPrivateAPSOUTHEAST1A.id,
          SubnetPrivateAPSOUTHEAST1B.id,
          SubnetPrivateAPSOUTHEAST1C.id,
        ],
        scalingConfig: {
          desiredSize: 1,
          maxSize: 1,
          minSize: 1,
        },
        updateConfig: {
          maxUnavailable: 1,
        },
      },
    ),
  }
);

export {
  Cluster,
  NodeGroup,
};
