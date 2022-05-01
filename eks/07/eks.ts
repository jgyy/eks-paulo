import * as aws from '@pulumi/aws';
import Parameters from './param';

class EKS extends Parameters {
  ControlPlane = () => {
    this.CheckCreated(
      'controlPlaneSecurityGroup',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
      'serviceRole',
    );
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
          securityGroupIds: [this.controlPlaneSecurityGroup.id],
          subnetIds: [
            this.subnetPublicAPSOUTHEAST1C.id,
            this.subnetPublicAPSOUTHEAST1B.id,
            this.subnetPublicAPSOUTHEAST1A.id,
            this.subnetPrivateAPSOUTHEAST1C.id,
            this.subnetPrivateAPSOUTHEAST1B.id,
            this.subnetPrivateAPSOUTHEAST1A.id,
          ],
        },
        roleArn: this.serviceRole.arn,
        tags: { Name: `${this.StackName}/${this.StackName}` },
        version: '1.22',
      },
    );
    return this.controlPlane;
  };

  NodeAddon = () => {
    this.CheckCreated('controlPlane');
    return new aws.eks.Addon(
      'NodeAddon',
      {
        clusterName: this.controlPlane.name,
        addonName: 'vpc-cni',
      },
    );
  };

  NodeGroupOnePublic = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng1-public',
      {
        nodeGroupName: 'ng1-public',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPublicAPSOUTHEAST1C.id,
          this.subnetPublicAPSOUTHEAST1B.id,
          this.subnetPublicAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 2,
          minSize: 1,
          maxSize: 2,
        },
        diskSize: 100,
        amiType: 'AL2_x86_64',
        updateConfig: { maxUnavailable: 2 },
        tags: { 'nodegroup-type': 'frontend-workloads' },
      },
    );
  };

  NodeGroupTwoPrivateA = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng2-private-a',
      {
        nodeGroupName: 'ng2-private-a',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPrivateAPSOUTHEAST1C.id,
          this.subnetPrivateAPSOUTHEAST1B.id,
          this.subnetPrivateAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 2,
          maxSize: 2,
          minSize: 1,
        },
        updateConfig: { maxUnavailable: 2 },
        tags: { 'nodegroup-type': 'backend-cluster-addons' },
      },
    );
  };

  NodeGroupThreePrivateB = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng3-private-b',
      {
        nodeGroupName: 'ng3-private-b',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPrivateAPSOUTHEAST1C.id,
          this.subnetPrivateAPSOUTHEAST1B.id,
          this.subnetPrivateAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 4,
          maxSize: 4,
          minSize: 1,
        },
        updateConfig: { maxUnavailable: 2 },
        taints: [
          {
            key: 'special',
            value: 'true',
            effect: 'NO_SCHEDULE',
          },
        ],
        tags: { 'nodegroup-type': 'very-special-science-workloads' },
      },
    );
  };

  NodeGroupFour = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng-4',
      {
        nodeGroupName: 'ng-4',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPrivateAPSOUTHEAST1C.id,
          this.subnetPrivateAPSOUTHEAST1B.id,
          this.subnetPrivateAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 1,
          maxSize: 2,
          minSize: 1,
        },
        updateConfig: { maxUnavailable: 1 },
      },
    );
  };

  NodeGroupFive = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng-5',
      {
        nodeGroupName: 'ng-5',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPrivateAPSOUTHEAST1C.id,
          this.subnetPrivateAPSOUTHEAST1B.id,
          this.subnetPrivateAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 1,
          maxSize: 2,
          minSize: 1,
        },
        updateConfig: { maxUnavailable: 1 },
      },
    );
  };

  NodeGroupSix = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng-6',
      {
        nodeGroupName: 'ng-6',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPrivateAPSOUTHEAST1C.id,
          this.subnetPrivateAPSOUTHEAST1B.id,
          this.subnetPrivateAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 1,
          maxSize: 2,
          minSize: 1,
        },
        updateConfig: { maxUnavailable: 1 },
      },
    );
  };

  NodeGroupSeven = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.eks.NodeGroup(
      'ng-7',
      {
        nodeGroupName: 'ng-7',
        instanceTypes: ['m5.large'],
        clusterName: this.controlPlane.name,
        nodeRoleArn: this.nodeInstanceRole.arn,
        subnetIds: [
          this.subnetPrivateAPSOUTHEAST1C.id,
          this.subnetPrivateAPSOUTHEAST1B.id,
          this.subnetPrivateAPSOUTHEAST1A.id,
        ],
        scalingConfig: {
          desiredSize: 1,
          maxSize: 1,
          minSize: 1,
        },
        updateConfig: { maxUnavailable: 1 },
      },
    );
  };
}

export default EKS;
