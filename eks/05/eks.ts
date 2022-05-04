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
        // amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.xlarge'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupOne,
          'nodegroup-type': 'frontend-workloads',
        },
        launchTemplate: {
          id: this.resource.launchTemplateOne.id,
          version: this.resource.launchTemplateOne.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupOne,
        scalingConfig: {
          desiredSize: 2,
          maxSize: 8,
          minSize: 2,
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
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupTwo = new aws.eks.NodeGroup(
      'ManagedNodeGroupTwo',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupTwo,
          'nodegroup-type': 'backend-cluster-addons',
        },
        launchTemplate: {
          id: this.resource.launchTemplateTwo.id,
          version: this.resource.launchTemplateTwo.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupTwo,
        scalingConfig: {
          desiredSize: 2,
          minSize: 2,
          maxSize: 2,
        },
        subnetIds: [
          this.resource.subnetPrivateAPSOUTHEAST1C.id,
          this.resource.subnetPrivateAPSOUTHEAST1B.id,
          this.resource.subnetPrivateAPSOUTHEAST1A.id,
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
      'subnetPrivateAPSOUTHEAST1A',
    );
    this.resource.managedNodeGroupThree = new aws.eks.NodeGroup(
      'ManagedNodeGroupThree',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['c6i.8xlarge'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupThree,
          'nodegroup-type': 'very-special-science-workloads',
        },
        launchTemplate: {
          id: this.resource.launchTemplateThree.id,
          version: this.resource.launchTemplateThree.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupThree,
        scalingConfig: {
          desiredSize: 4,
          minSize: 4,
          maxSize: 4,
        },
        subnetIds: [
          this.resource.subnetPrivateAPSOUTHEAST1C.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupThree,
          'alpha.io/nodegroup-type': 'managed',
        },
        taints: [
          {
            effect: 'NO_SCHEDULE',
            key: 'special',
            value: 'true',
          },
        ],
      },
    );
    return this.resource.managedNodeGroupThree;
  };
}

export default EKS;
