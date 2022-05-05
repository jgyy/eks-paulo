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
      'subnetPrivateAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroupOne = new aws.eks.NodeGroup(
      'ManagedNodeGroupOne',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.xlarge'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupOne,
        },
        launchTemplate: {
          id: this.resource.launchTemplateOne.id,
          version: this.resource.launchTemplateOne.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupOne,
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
        },
        launchTemplate: {
          id: this.resource.launchTemplateTwo.id,
          version: this.resource.launchTemplateTwo.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupTwo,
        scalingConfig: {
          desiredSize: 10,
          minSize: 10,
          maxSize: 10,
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
}

export default EKS;
