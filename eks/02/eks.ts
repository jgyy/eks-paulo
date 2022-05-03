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

  ManagedNodeGroup = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplate',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.resource.managedNodeGroup = new aws.eks.NodeGroup(
      'ManagedNodeGroup',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.resource.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupName,
        },
        launchTemplate: {
          id: this.resource.launchTemplate.id,
          version: this.resource.launchTemplate.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.resource.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupName,
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
          'alpha.io/nodegroup-name': this.NodeGroupName,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.resource.managedNodeGroup;
  };
}

export default EKS;
