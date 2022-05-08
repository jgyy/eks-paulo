import * as aws from '@pulumi/aws';
import Parameters from './param';
import Resources from './resource';

class EKS extends Parameters {
  constructor(resource: Resources) {
    super();
    this.resource = resource;
  }

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
    this.resource.controlPlane = new aws.eks.Cluster(
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
          securityGroupIds: [this.resource.controlPlaneSecurityGroup.id],
          subnetIds: [
            this.resource.subnetPublicAPSOUTHEAST1C.id,
            this.resource.subnetPublicAPSOUTHEAST1B.id,
            this.resource.subnetPublicAPSOUTHEAST1A.id,
            this.resource.subnetPrivateAPSOUTHEAST1C.id,
            this.resource.subnetPrivateAPSOUTHEAST1B.id,
            this.resource.subnetPrivateAPSOUTHEAST1A.id,
          ],
        },
        roleArn: this.resource.serviceRole.arn,
        tags: { Name: `${this.StackName}/${this.StackName}` },
        version: '1.22',
      },
    );
    return this.resource.controlPlane;
  };

  NodeAddon = () => {
    this.CheckCreated('controlPlane');
    return new aws.eks.Addon(
      'NodeAddon',
      {
        clusterName: this.resource.controlPlane.name,
        addonName: 'vpc-cni',
      },
    );
  };

  ManagedNodeGroupOne = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateOne',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupOne = new aws.eks.NodeGroup(
      'ManagedNodeGroupOne',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupOne,
          [`k8s.io/cluster-autoscaler/${this.StackName}`]: 'owned',
          'k8s.io/cluster-autoscaler/enabled': 'true',
        },
        launchTemplate: {
          id: this.resource.launchTemplateOne.id,
          version: this.resource.launchTemplateOne.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupOne,
        scalingConfig: {
          desiredSize: 1,
          maxSize: 1,
          minSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupOne,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupOne;
  };

  ManagedNodeGroupTwo = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateTwo',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupTwo = new aws.eks.NodeGroup(
      'ManagedNodeGroupTwo',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.xlarge'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupTwo,
        },
        launchTemplate: {
          id: this.resource.launchTemplateTwo.id,
          version: this.resource.launchTemplateTwo.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupTwo,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupTwo,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupTwo;
  };

  ManagedNodeGroupThree = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateThree',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupThree = new aws.eks.NodeGroup(
      'ManagedNodeGroupThree',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupThree,
        },
        launchTemplate: {
          id: this.resource.launchTemplateThree.id,
          version: this.resource.launchTemplateThree.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupThree,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupThree,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupThree;
  };

  ManagedNodeGroupFour = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateFour',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupFour = new aws.eks.NodeGroup(
      'ManagedNodeGroupFour',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupFour,
        },
        launchTemplate: {
          id: this.resource.launchTemplateFour.id,
          version: this.resource.launchTemplateFour.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupFour,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupFour,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupFour;
  };

  ManagedNodeGroupFive = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateFive',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupFive = new aws.eks.NodeGroup(
      'ManagedNodeGroupFive',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupFive,
        },
        launchTemplate: {
          id: this.resource.launchTemplateFive.id,
          version: this.resource.launchTemplateFive.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupFive,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupFive,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupFive;
  };

  ManagedNodeGroupSix = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateSix',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupSix = new aws.eks.NodeGroup(
      'ManagedNodeGroupSix',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupSix,
        },
        launchTemplate: {
          id: this.resource.launchTemplateSix.id,
          version: this.resource.launchTemplateSix.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupSix,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupSix,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupSix;
  };

  ManagedNodeGroupSeven = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplateSeven',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupSeven = new aws.eks.NodeGroup(
      'ManagedNodeGroupSeven',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupSeven,
        },
        launchTemplate: {
          id: this.resource.launchTemplateSeven.id,
          version: this.resource.launchTemplateSeven.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupSeven,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.resource.subnetPublicAPSOUTHEAST1C.id,
          this.resource.subnetPublicAPSOUTHEAST1B.id,
          this.resource.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupSeven,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroupSeven;
  };
}

export default EKS;
