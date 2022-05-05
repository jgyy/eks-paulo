import * as aws from '@pulumi/aws';
import Parameters from './param';
import Resources from './resource';

class LAUNCH extends Parameters {
  constructor(resource: Resources) {
    super();
    this.resource = resource;
  }

  LaunchTemplateOne = () => {
    this.CheckCreated('controlPlane', 'ssh', 'devKey');
    this.resource.launchTemplateOne = new aws.ec2.LaunchTemplate(
      'LaunchTemplateOne',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        keyName: this.resource.devKey.keyName,
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
          this.resource.ssh.id,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupOne}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupOne,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupOne}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupOne,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupOne}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupOne,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateOne',
      },
    );
    return this.resource.launchTemplateOne;
  };

  LaunchTemplateTwo = () => {
    this.CheckCreated('controlPlane', 'ssh');
    this.resource.launchTemplateTwo = new aws.ec2.LaunchTemplate(
      'LaunchTemplateTwo',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        keyName: this.resource.devKey.keyName,
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
          this.resource.ssh.id,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupTwo}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupTwo,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupTwo}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupTwo,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupTwo}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupTwo,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateTwo',
      },
    );
    return this.resource.launchTemplateTwo;
  };

  LaunchTemplateThree = () => {
    this.CheckCreated('controlPlane', 'ssh');
    this.resource.launchTemplateThree = new aws.ec2.LaunchTemplate(
      'LaunchTemplateThree',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        keyName: this.resource.devKey.keyName,
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
          this.resource.ssh.id,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupThree}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupThree,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupThree}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupThree,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupThree}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupThree,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateThree',
      },
    );
    return this.resource.launchTemplateThree;
  };

  LaunchTemplateFour = () => {
    this.CheckCreated('controlPlane', 'ssh');
    this.resource.launchTemplateFour = new aws.ec2.LaunchTemplate(
      'LaunchTemplateFour',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        keyName: this.resource.devKey.keyName,
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
          this.resource.ssh.id,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupFour}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupFour,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupFour}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupFour,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupFour}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupFour,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateFour',
      },
    );
    return this.resource.launchTemplateFour;
  };

  LaunchTemplateFive = () => {
    this.CheckCreated('controlPlane');
    this.resource.launchTemplateFive = new aws.ec2.LaunchTemplate(
      'LaunchTemplateFive',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        keyName: this.resource.devKey.keyName,
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupFive}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupFive,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupFive}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupFive,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupFive}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupFive,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateFive',
      },
    );
    return this.resource.launchTemplateFive;
  };

  LaunchTemplateSix = () => {
    this.CheckCreated('controlPlane');
    this.resource.launchTemplateSix = new aws.ec2.LaunchTemplate(
      'LaunchTemplateSix',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupSix}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupSix,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupSix}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupSix,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupSix}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupSix,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateSix',
      },
    );
    return this.resource.launchTemplateSix;
  };

  LaunchTemplateSeven = () => {
    this.CheckCreated('controlPlane');
    this.resource.launchTemplateSeven = new aws.ec2.LaunchTemplate(
      'LaunchTemplateSeven',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            iops: 3000,
            throughput: 125,
            volumeSize: 80,
            volumeType: 'gp3',
          },
        }],
        metadataOptions: {
          httpPutResponseHopLimit: 2,
          httpTokens: 'optional',
        },
        vpcSecurityGroupIds: [
          this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
        ],
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupSeven}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupSeven,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'volume',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupSeven}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupSeven,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
          {
            resourceType: 'network-interface',
            tags: {
              Name: `${this.StackName}-${this.NodeGroupSeven}-Node`,
              'alpha.io/nodegroup-name': this.NodeGroupSeven,
              'alpha.io/nodegroup-type': 'managed',
            },
          },
        ],
        name: 'LaunchTemplateSeven',
      },
    );
    return this.resource.launchTemplateSeven;
  };
}

export default LAUNCH;
