import * as aws from '@pulumi/aws';
import Parameters from './param';

class EKS extends Parameters {
  controlPlane: aws.eks.Cluster | null = null;

  ControlPlaneSecurityGroup: aws.ec2.SecurityGroup | null = null;

  NodeInstanceRole: aws.iam.Role | null = null;

  ServiceRole: aws.iam.Role | null = null;

  SubnetPrivateAPSOUTHEAST1C: aws.ec2.Subnet | null = null;

  SubnetPrivateAPSOUTHEAST1B: aws.ec2.Subnet | null = null;

  SubnetPrivateAPSOUTHEAST1A: aws.ec2.Subnet | null = null;

  SubnetPublicAPSOUTHEAST1C: aws.ec2.Subnet | null = null;

  SubnetPublicAPSOUTHEAST1B: aws.ec2.Subnet | null = null;

  SubnetPublicAPSOUTHEAST1A: aws.ec2.Subnet | null = null;

  ControlPlane = () => {
    if (
      this.ControlPlaneSecurityGroup
      && this.SubnetPublicAPSOUTHEAST1C
      && this.SubnetPublicAPSOUTHEAST1B
      && this.SubnetPublicAPSOUTHEAST1A
      && this.SubnetPrivateAPSOUTHEAST1C
      && this.SubnetPrivateAPSOUTHEAST1B
      && this.SubnetPrivateAPSOUTHEAST1A
      && this.ServiceRole
    ) {
      this.controlPlane = new aws.eks.Cluster(
        this.StackName,
        {
          kubernetesNetworkConfig: {},
          enabledClusterLogTypes: [
            'audit',
            'authenticator',
            'controllerManager',
          ],
          name: this.StackName,
          vpcConfig: {
            endpointPrivateAccess: false,
            endpointPublicAccess: true,
            securityGroupIds: [this.ControlPlaneSecurityGroup.id],
            subnetIds: [
              this.SubnetPublicAPSOUTHEAST1C.id,
              this.SubnetPublicAPSOUTHEAST1B.id,
              this.SubnetPublicAPSOUTHEAST1A.id,
              this.SubnetPrivateAPSOUTHEAST1C.id,
              this.SubnetPrivateAPSOUTHEAST1B.id,
              this.SubnetPrivateAPSOUTHEAST1A.id,
            ],
          },
          roleArn: this.ServiceRole.arn,
          tags: { Name: `${this.StackName}/${this.StackName}` },
          version: '1.22',
        },
      );
      return this.controlPlane;
    }
    throw new Error(`
    ControlPlaneSecurityGroup = ${this.ControlPlaneSecurityGroup}
    SubnetPublicAPSOUTHEAST1C = ${this.SubnetPublicAPSOUTHEAST1C}
    SubnetPublicAPSOUTHEAST1B = ${this.SubnetPublicAPSOUTHEAST1B}
    SubnetPublicAPSOUTHEAST1A = ${this.SubnetPublicAPSOUTHEAST1A}
    SubnetPrivateAPSOUTHEAST1C = ${this.SubnetPrivateAPSOUTHEAST1C}
    SubnetPrivateAPSOUTHEAST1B = ${this.SubnetPrivateAPSOUTHEAST1B}
    SubnetPrivateAPSOUTHEAST1A = ${this.SubnetPrivateAPSOUTHEAST1A}
    ServiceRole = ${this.ServiceRole}
    `);
  };

  NodeGroupOne = () => {
    if (
      this.controlPlane
      && this.NodeInstanceRole
      && this.SubnetPrivateAPSOUTHEAST1A
      && this.SubnetPrivateAPSOUTHEAST1B
      && this.SubnetPrivateAPSOUTHEAST1C
    ) {
      return new aws.eks.NodeGroup(
        'ng-1',
        {
          nodeGroupName: 'ng-1',
          instanceTypes: ['m5.large'],
          clusterName: this.controlPlane.name,
          nodeRoleArn: this.NodeInstanceRole.arn,
          subnetIds: [
            this.SubnetPrivateAPSOUTHEAST1C.id,
            this.SubnetPrivateAPSOUTHEAST1B.id,
            this.SubnetPrivateAPSOUTHEAST1A.id,
          ],
          scalingConfig: {
            desiredSize: 1,
            maxSize: 1,
            minSize: 1,
          },
          updateConfig: { maxUnavailable: 1 },
        },
      );
    }
    throw new Error(`
    controlPlane = ${this.controlPlane}
    SubnetPrivateAPSOUTHEAST1C = ${this.SubnetPrivateAPSOUTHEAST1C}
    SubnetPrivateAPSOUTHEAST1B = ${this.SubnetPrivateAPSOUTHEAST1B}
    SubnetPrivateAPSOUTHEAST1A = ${this.SubnetPrivateAPSOUTHEAST1A}
    NodeInstanceRole = ${this.NodeInstanceRole}
    `);
  };

  NodeGroupOnePublic = () => {
    if (
      this.controlPlane
      && this.NodeInstanceRole
      && this.SubnetPublicAPSOUTHEAST1A
      && this.SubnetPublicAPSOUTHEAST1B
      && this.SubnetPublicAPSOUTHEAST1C
    ) {
      return new aws.eks.NodeGroup(
        'ng1-public',
        {
          nodeGroupName: 'ng1-public',
          instanceTypes: ['m5.xlarge'],
          clusterName: this.controlPlane.name,
          nodeRoleArn: this.NodeInstanceRole.arn,
          subnetIds: [
            this.SubnetPublicAPSOUTHEAST1C.id,
            this.SubnetPublicAPSOUTHEAST1B.id,
            this.SubnetPublicAPSOUTHEAST1A.id,
          ],
          scalingConfig: {
            desiredSize: 4,
            maxSize: 4,
            minSize: 4,
          },
          updateConfig: { maxUnavailable: 4 },
          tags: { Name: 'custom-node-name' },
        },
      );
    }
    throw new Error(`
    controlPlane = ${this.controlPlane}
    SubnetPublicAPSOUTHEAST1A = ${this.SubnetPublicAPSOUTHEAST1A}
    SubnetPublicAPSOUTHEAST1B = ${this.SubnetPublicAPSOUTHEAST1B}
    SubnetPublicAPSOUTHEAST1C = ${this.SubnetPublicAPSOUTHEAST1C}
    NodeInstanceRole = ${this.NodeInstanceRole}
    `);
  };

  NodeGroupTwoPrivate = () => {
    if (
      this.controlPlane
      && this.NodeInstanceRole
      && this.SubnetPrivateAPSOUTHEAST1C
      && this.SubnetPrivateAPSOUTHEAST1B
      && this.SubnetPrivateAPSOUTHEAST1A
    ) {
      return new aws.eks.NodeGroup(
        'ng2-private',
        {
          nodeGroupName: 'ng2-private',
          instanceTypes: ['m5.xlarge'],
          clusterName: this.controlPlane.name,
          nodeRoleArn: this.NodeInstanceRole.arn,
          subnetIds: [
            this.SubnetPrivateAPSOUTHEAST1C.id,
            this.SubnetPrivateAPSOUTHEAST1B.id,
            this.SubnetPrivateAPSOUTHEAST1A.id,
          ],
          scalingConfig: {
            desiredSize: 10,
            maxSize: 10,
            minSize: 10,
          },
          updateConfig: { maxUnavailable: 10 },
          tags: { Name: 'custom-node-name' },
        },
      );
    }
    throw new Error(`
    controlPlane = ${this.controlPlane}
    SubnetPrivateAPSOUTHEAST1C = ${this.SubnetPrivateAPSOUTHEAST1C}
    SubnetPrivateAPSOUTHEAST1B = ${this.SubnetPrivateAPSOUTHEAST1B}
    SubnetPrivateAPSOUTHEAST1A = ${this.SubnetPrivateAPSOUTHEAST1A}
    NodeInstanceRole = ${this.NodeInstanceRole}
    `);
  };
}

export default EKS;
