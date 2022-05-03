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

  ManagedNodeGroup = () => {
    this.CheckCreated(
      'controlPlane',
      'nodeInstanceRole',
      'launchTemplate',
      'subnetPublicAPSOUTHEAST1A',
      'subnetPublicAPSOUTHEAST1B',
      'subnetPublicAPSOUTHEAST1C',
    );
    this.managedNodeGroup = new aws.eks.NodeGroup(
      'ManagedNodeGroup',
      {
        amiType: 'AL2_x86_64',
        clusterName: this.controlPlane.name,
        instanceTypes: ['m5.large'],
        labels: {
          'alpha.io/cluster-name': this.StackName,
          'alpha.io/nodegroup-name': this.NodeGroupName,
        },
        launchTemplate: { 
          id: this.launchTemplate.id,
          version: this.launchTemplate.latestVersion.apply((v) => v.toString()),
        },
        nodeRoleArn: this.nodeInstanceRole.arn,
        nodeGroupName: this.NodeGroupName,
        scalingConfig: {
          desiredSize: 1,
          minSize: 1,
          maxSize: 1,
        },
        subnetIds: [
          this.subnetPublicAPSOUTHEAST1C.id,
          this.subnetPublicAPSOUTHEAST1B.id,
          this.subnetPublicAPSOUTHEAST1A.id,
        ],
        tags: {
          'alpha.io/nodegroup-name': this.NodeGroupName,
          'alpha.io/nodegroup-type': 'managed',
        },
      },
    );
    return this.managedNodeGroup;
  };
}

export default EKS;
