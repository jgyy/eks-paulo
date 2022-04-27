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
      return new aws.eks.Cluster(
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
            endpointPrivateAccess: true,
            endpointPublicAccess: false,
            securityGroupIds: [
              this.ControlPlaneSecurityGroup.id,
            ],
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

  NodeGroup = () => {
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
            this.SubnetPrivateAPSOUTHEAST1A.id,
            this.SubnetPrivateAPSOUTHEAST1B.id,
            this.SubnetPrivateAPSOUTHEAST1C.id,
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
