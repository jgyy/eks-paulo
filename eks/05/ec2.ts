import * as aws from '@pulumi/aws';
import * as awsn from '@pulumi/aws-native';
import * as fs from 'fs';
import Parameters from './param';
import Resources from './resource';

class EC2 extends Parameters {
  constructor(resource: Resources) {
    super();
    this.resource = resource;
  }

  ClusterSharedNodeSecurityGroup = () => {
    this.CheckCreated('vpc');
    this.resource.clusterSharedNodeSecurityGroup = new aws.ec2.SecurityGroup(
      'ClusterSharedNodeSecurityGroup',
      {
        description: 'Communication between all nodes in the cluster',
        tags: { Name: `${this.StackName}/ClusterSharedNodeSecurityGroup` },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.clusterSharedNodeSecurityGroup;
  };

  ControlPlaneSecurityGroup = () => {
    this.CheckCreated('vpc');
    this.resource.controlPlaneSecurityGroup = new aws.ec2.SecurityGroup(
      'ControlPlaneSecurityGroup',
      {
        description: 'Communication between the control plane and worker nodegroups',
        tags: { Name: `${this.StackName}/ControlPlaneSecurityGroup` },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.controlPlaneSecurityGroup;
  };

  DevKey = () => {
    this.resource.devKey = new aws.ec2.KeyPair(
      'deployer',
      { publicKey: fs.readFileSync('/Users/jgyy/.ssh/id_rsa.pub', 'utf8') },
    );
    return this.resource.devKey;
  };

  EgressInterCluster = () => {
    this.CheckCreated('controlPlaneSecurityGroup', 'sg');
    return new aws.ec2.SecurityGroupRule(
      'EgressInterCluster',
      {
        type: 'egress',
        description: 'Allow control plane to communicate with worker nodes in group ng'
          + ' (kubelet and workload TCP ports)',
        fromPort: 1025,
        securityGroupId: this.resource.controlPlaneSecurityGroup.id,
        protocol: 'tcp',
        sourceSecurityGroupId: this.resource.sg.id,
        toPort: 65535,
      },
    );
  };

  EgressInterClusterAPI = () => {
    this.CheckCreated('controlPlaneSecurityGroup', 'sg');
    return new aws.ec2.SecurityGroupRule(
      'EgressInterClusterAPI',
      {
        type: 'egress',
        description: 'Allow control plane to communicate with worker nodes in group ng'
          + ' (workloads using HTTPS port, commonly used with extension API servers)',
        fromPort: 443,
        securityGroupId: this.resource.controlPlaneSecurityGroup.id,
        protocol: 'tcp',
        sourceSecurityGroupId: this.resource.sg.id,
        toPort: 443,
      },
    );
  };

  IngressInterClusterCP = () => {
    this.CheckCreated('controlPlaneSecurityGroup', 'sg');
    return new aws.ec2.SecurityGroupRule(
      'IngressInterClusterCP',
      {
        type: 'ingress',
        description: 'Allow control plane to receive API requests from worker nodes in group ng',
        fromPort: 443,
        securityGroupId: this.resource.controlPlaneSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: this.resource.sg.id,
        toPort: 443,
      },
    );
  };

  IngressDefaultClusterToNodeSG = () => {
    this.CheckCreated('clusterSharedNodeSecurityGroup', 'controlPlane');
    return new aws.ec2.SecurityGroupRule(
      'IngressDefaultClusterToNodeSG',
      {
        type: 'ingress',
        description: 'Allow managed and unmanaged nodes to communicate with each other (all'
          + ' ports)',
        fromPort: 0,
        securityGroupId: this.resource.clusterSharedNodeSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
        toPort: 65535,
      },
    );
  };

  IngressInterNodeGroupSG = () => {
    this.CheckCreated('clusterSharedNodeSecurityGroup');
    return new aws.ec2.SecurityGroupRule(
      'IngressInterNodeGroupSG',
      {
        type: 'ingress',
        description: 'Allow nodes to communicate with each other (all ports)',
        fromPort: 0,
        securityGroupId: this.resource.clusterSharedNodeSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: this.resource.clusterSharedNodeSecurityGroup.id,
        toPort: 65535,
      },
    );
  };

  IngressNodeToDefaultClusterSG = () => {
    this.CheckCreated('clusterSharedNodeSecurityGroup', 'controlPlane');
    return new aws.ec2.SecurityGroupRule(
      'IngressNodeToDefaultClusterSG',
      {
        type: 'ingress',
        description: 'Allow unmanaged nodes to communicate with control plane (all ports)',
        fromPort: 0,
        securityGroupId: this.resource.controlPlane.vpcConfig.clusterSecurityGroupId,
        protocol: '-1',
        sourceSecurityGroupId: this.resource.clusterSharedNodeSecurityGroup.id,
        toPort: 65535,
      },
    );
  };

  InternetGateway = () => {
    this.resource.internetGateway = new aws.ec2.InternetGateway(
      'InternetGateway',
      {
        tags: { Name: `${this.StackName}/InternetGateway` },
      },
    );
    return this.resource.internetGateway;
  };

  LaunchTemplateOne = () => {
    this.CheckCreated('controlPlane');
    this.resource.launchTemplateOne = new aws.ec2.LaunchTemplate(
      'LaunchTemplateOne',
      {
        blockDeviceMappings: [{
          deviceName: '/dev/xvda',
          ebs: {
            encrypted: 'false',
            volumeSize: 100,
            volumeType: 'gp2',
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
    this.CheckCreated('controlPlane');
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
        userData: Buffer.from(
          fs.readFileSync(`${__dirname}/userdata2.txt`),
        ).toString('base64'),
        name: 'LaunchTemplateTwo',
      },
    );
    return this.resource.launchTemplateTwo;
  };

  LaunchTemplateThree = () => {
    this.CheckCreated('controlPlane');
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
        userData: Buffer.from(
          fs.readFileSync(`${__dirname}/userdata3.txt`),
        ).toString('base64'),
        name: 'LaunchTemplateThree',
      },
    );
    return this.resource.launchTemplateThree;
  };

  NATGatewayAPSOUTHEAST1A = () => {
    this.CheckCreated('natIPAPSOUTHEAST1A', 'subnetPublicAPSOUTHEAST1A');
    this.resource.natGatewayAPSOUTHEAST1A = new aws.ec2.NatGateway(
      'NATGatewayAPSOUTHEAST1A',
      {
        allocationId: this.resource.natIPAPSOUTHEAST1A.id,
        subnetId: this.resource.subnetPublicAPSOUTHEAST1A.id,
        tags: { Name: `${this.StackName}/NATGatewayAPSOUTHEAST1A` },
      },
    );
    return this.resource.natGatewayAPSOUTHEAST1A;
  };

  NATGatewayAPSOUTHEAST1B = () => {
    this.CheckCreated('natIPAPSOUTHEAST1B', 'subnetPublicAPSOUTHEAST1B');
    this.resource.natGatewayAPSOUTHEAST1B = new aws.ec2.NatGateway(
      'NATGatewayAPSOUTHEAST1B',
      {
        allocationId: this.resource.natIPAPSOUTHEAST1B.id,
        subnetId: this.resource.subnetPublicAPSOUTHEAST1B.id,
        tags: { Name: `${this.StackName}/NATGatewayAPSOUTHEAST1B` },
      },
    );
    return this.resource.natGatewayAPSOUTHEAST1B;
  };

  NATGatewayAPSOUTHEAST1C = () => {
    this.CheckCreated('natIPAPSOUTHEAST1C', 'subnetPublicAPSOUTHEAST1C');
    this.resource.natGatewayAPSOUTHEAST1C = new aws.ec2.NatGateway(
      'NATGatewayAPSOUTHEAST1C',
      {
        allocationId: this.resource.natIPAPSOUTHEAST1C.id,
        subnetId: this.resource.subnetPublicAPSOUTHEAST1C.id,
        tags: { Name: `${this.StackName}/NATGatewayAPSOUTHEAST1C` },
      },
    );
    return this.resource.natGatewayAPSOUTHEAST1C;
  };

  NATIPAPSOUTHEAST1A = () => {
    this.resource.natIPAPSOUTHEAST1A = new aws.ec2.Eip(
      'NATIPAPSOUTHEAST1A',
      {
        vpc: true,
        tags: { Name: `${this.StackName}/NATIPAPSOUTHEAST1A` },
      },
    );
    return this.resource.natIPAPSOUTHEAST1A;
  };

  NATIPAPSOUTHEAST1B = () => {
    this.resource.natIPAPSOUTHEAST1B = new aws.ec2.Eip(
      'NATIPAPSOUTHEAST1B',
      {
        vpc: true,
        tags: { Name: `${this.StackName}/NATIPAPSOUTHEAST1B` },
      },
    );
    return this.resource.natIPAPSOUTHEAST1B;
  };

  NATIPAPSOUTHEAST1C = () => {
    this.resource.natIPAPSOUTHEAST1C = new aws.ec2.Eip(
      'NATIPAPSOUTHEAST1C',
      {
        vpc: true,
        tags: { Name: `${this.StackName}/NATIPAPSOUTHEAST1C` },
      },
    );
    return this.resource.natIPAPSOUTHEAST1C;
  };

  NATPrivateSubnetRouteAPSOUTHEAST1A = () => {
    this.CheckCreated(
      'natGatewayAPSOUTHEAST1A',
      'privateRouteTableAPSOUTHEAST1A',
    );
    return new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1A',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.resource.natGatewayAPSOUTHEAST1A.id,
        routeTableId: this.resource.privateRouteTableAPSOUTHEAST1A.id,
      },
    );
  };

  NATPrivateSubnetRouteAPSOUTHEAST1B = () => {
    this.CheckCreated(
      'natGatewayAPSOUTHEAST1B',
      'privateRouteTableAPSOUTHEAST1B',
    );
    return new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1B',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.resource.natGatewayAPSOUTHEAST1B.id,
        routeTableId: this.resource.privateRouteTableAPSOUTHEAST1B.id,
      },
    );
  };

  NATPrivateSubnetRouteAPSOUTHEAST1C = () => {
    this.CheckCreated('natGatewayAPSOUTHEAST1C', 'privateRouteTableAPSOUTHEAST1C');
    return new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1C',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.resource.natGatewayAPSOUTHEAST1C.id,
        routeTableId: this.resource.privateRouteTableAPSOUTHEAST1C.id,
      },
    );
  };

  PublicRouteTable = () => {
    this.CheckCreated('vpc');
    this.resource.publicRouteTable = new aws.ec2.RouteTable(
      'PublicRouteTable',
      {
        tags: { Name: `${this.StackName}/PublicRouteTable` },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.publicRouteTable;
  };

  PrivateRouteTableAPSOUTHEAST1A = () => {
    this.CheckCreated('vpc');
    this.resource.privateRouteTableAPSOUTHEAST1A = new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1A',
      {
        tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1A` },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.privateRouteTableAPSOUTHEAST1A;
  };

  PrivateRouteTableAPSOUTHEAST1B = () => {
    this.CheckCreated('vpc');
    this.resource.privateRouteTableAPSOUTHEAST1B = new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1B',
      {
        tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1B` },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.privateRouteTableAPSOUTHEAST1B;
  };

  PrivateRouteTableAPSOUTHEAST1C = () => {
    this.CheckCreated('vpc');
    this.resource.privateRouteTableAPSOUTHEAST1C = new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1C',
      {
        tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1C` },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.privateRouteTableAPSOUTHEAST1C;
  };

  PublicSubnetRoute = () => {
    this.CheckCreated(
      'internetGateway',
      'publicRouteTable',
      'vpcGatewayAttachment',
    );
    return new aws.ec2.Route(
      'PublicSubnetRoute',
      {
        destinationCidrBlock: '0.0.0.0/0',
        gatewayId: this.resource.internetGateway.id,
        routeTableId: this.resource.publicRouteTable.id,
      },
      { dependsOn: [this.resource.vpcGatewayAttachment] },
    );
  };

  RouteTableAssociationPrivateAPSOUTHEAST1A = () => {
    this.CheckCreated(
      'privateRouteTableAPSOUTHEAST1A',
      'subnetPrivateAPSOUTHEAST1A',
    );
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPrivateAPSOUTHEAST1A',
      {
        routeTableId: this.resource.privateRouteTableAPSOUTHEAST1A.id,
        subnetId: this.resource.subnetPrivateAPSOUTHEAST1A.id,
      },
    );
  };

  RouteTableAssociationPrivateAPSOUTHEAST1B = () => {
    this.CheckCreated(
      'privateRouteTableAPSOUTHEAST1B',
      'subnetPrivateAPSOUTHEAST1B',
    );
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPrivateAPSOUTHEAST1B',
      {
        routeTableId: this.resource.privateRouteTableAPSOUTHEAST1B.id,
        subnetId: this.resource.subnetPrivateAPSOUTHEAST1B.id,
      },
    );
  };

  RouteTableAssociationPrivateAPSOUTHEAST1C = () => {
    this.CheckCreated(
      'privateRouteTableAPSOUTHEAST1C',
      'subnetPrivateAPSOUTHEAST1C',
    );
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPrivateAPSOUTHEAST1C',
      {
        routeTableId: this.resource.privateRouteTableAPSOUTHEAST1C.id,
        subnetId: this.resource.subnetPrivateAPSOUTHEAST1C.id,
      },
    );
  };

  RouteTableAssociationPublicAPSOUTHEAST1A = () => {
    this.CheckCreated('publicRouteTable', 'subnetPublicAPSOUTHEAST1A');
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1A',
      {
        routeTableId: this.resource.publicRouteTable.id,
        subnetId: this.resource.subnetPublicAPSOUTHEAST1A.id,
      },
    );
  };

  RouteTableAssociationPublicAPSOUTHEAST1B = () => {
    this.CheckCreated('publicRouteTable', 'subnetPublicAPSOUTHEAST1B');
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1B',
      {
        routeTableId: this.resource.publicRouteTable.id,
        subnetId: this.resource.subnetPublicAPSOUTHEAST1B.id,
      },
    );
  };

  RouteTableAssociationPublicAPSOUTHEAST1C = () => {
    this.CheckCreated('publicRouteTable', 'subnetPublicAPSOUTHEAST1C');
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1C',
      {
        routeTableId: this.resource.publicRouteTable.id,
        subnetId: this.resource.subnetPublicAPSOUTHEAST1C.id,
      },
    );
  };

  SG = () => {
    this.CheckCreated('vpc');
    this.resource.sg = new aws.ec2.SecurityGroup(
      'SG',
      {
        description: 'Communication between the control plane and worker nodes in group ng',
        ingress: [
          {
            description: '[IngressInterCluster] Allow worker nodes in group ng to'
              + ' communicate with control plane (kubelet and workload TCP ports)',
            fromPort: 1025,
            protocol: 'tcp',
            securityGroups: [this.resource.controlPlaneSecurityGroup.id],
            toPort: 65535,
          },
          {
            description: '[IngressInterClusterAPI] Allow worker nodes in group ng to'
              + ' communicate with control plane (workloads using HTTPS port, commonly'
              + ' used with extension API servers)',
            fromPort: 443,
            protocol: 'tcp',
            securityGroups: [this.resource.controlPlaneSecurityGroup.id],
            toPort: 443,
          },
        ],
        tags: {
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SG`,
        },
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.sg;
  };

  SubnetPrivateAPSOUTHEAST1A = () => {
    this.CheckCreated('vpc');
    this.resource.subnetPrivateAPSOUTHEAST1A = new awsn.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1A',
      {
        availabilityZone: this.AvailabilityZones()[0],
        cidrBlock: '192.168.0.0/19',
        tags: [
          {
            key: 'kubernetes.io/role/internal-elb',
            value: '1',
          },
          {
            key: 'Name',
            value: `${this.StackName}/SubnetPrivateAPSOUTHEAST1A`,
          },
        ],
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.subnetPrivateAPSOUTHEAST1A;
  };

  SubnetPrivateAPSOUTHEAST1B = () => {
    this.CheckCreated('vpc');
    this.resource.subnetPrivateAPSOUTHEAST1B = new awsn.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1B',
      {
        availabilityZone: this.AvailabilityZones()[1],
        cidrBlock: '192.168.32.0/19',
        tags: [
          {
            key: 'kubernetes.io/role/internal-elb',
            value: '1',
          },
          {
            key: 'Name',
            value: `${this.StackName}/SubnetPrivateAPSOUTHEAST1B`,
          },
        ],
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.subnetPrivateAPSOUTHEAST1B;
  };

  SubnetPrivateAPSOUTHEAST1C = () => {
    this.CheckCreated('vpc');
    this.resource.subnetPrivateAPSOUTHEAST1C = new awsn.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1C',
      {
        availabilityZone: this.AvailabilityZones()[2],
        cidrBlock: '192.168.64.0/19',
        tags: [
          {
            key: 'kubernetes.io/role/internal-elb',
            value: '1',
          },
          {
            key: 'Name',
            value: `${this.StackName}/SubnetPrivateAPSOUTHEAST1C`,
          },
        ],
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.subnetPrivateAPSOUTHEAST1C;
  };

  SubnetPublicAPSOUTHEAST1A = () => {
    this.CheckCreated('vpc');
    this.resource.subnetPublicAPSOUTHEAST1A = new awsn.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1A',
      {
        mapPublicIpOnLaunch: true,
        availabilityZone: this.AvailabilityZones()[0],
        cidrBlock: '192.168.96.0/19',
        tags: [
          {
            key: 'kubernetes.io/role/internal-elb',
            value: '1',
          },
          {
            key: 'Name',
            value: `${this.StackName}/SubnetPublicAPSOUTHEAST1A`,
          },
        ],
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.subnetPublicAPSOUTHEAST1A;
  };

  SubnetPublicAPSOUTHEAST1B = () => {
    this.CheckCreated('vpc');
    this.resource.subnetPublicAPSOUTHEAST1B = new awsn.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1B',
      {
        mapPublicIpOnLaunch: true,
        availabilityZone: this.AvailabilityZones()[1],
        cidrBlock: '192.168.128.0/19',
        tags: [
          {
            key: 'kubernetes.io/role/internal-elb',
            value: '1',
          },
          {
            key: 'Name',
            value: `${this.StackName}/SubnetPublicAPSOUTHEAST1B`,
          },
        ],
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.subnetPublicAPSOUTHEAST1B;
  };

  SubnetPublicAPSOUTHEAST1C = () => {
    this.CheckCreated('vpc');
    this.resource.subnetPublicAPSOUTHEAST1C = new awsn.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1C',
      {
        mapPublicIpOnLaunch: true,
        availabilityZone: this.AvailabilityZones()[2],
        cidrBlock: '192.168.160.0/19',
        tags: [
          {
            key: 'kubernetes.io/role/internal-elb',
            value: '1',
          },
          {
            key: 'Name',
            value: `${this.StackName}/SubnetPublicAPSOUTHEAST1C`,
          },
        ],
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.subnetPublicAPSOUTHEAST1C;
  };

  VPC = () => {
    this.resource.vpc = new awsn.ec2.VPC(
      'VPC',
      {
        cidrBlock: '192.168.0.0/16',
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: [
          {
            key: 'Name',
            value: `${this.StackName}/VPC`,
          },
        ],
      },
    );
    return this.resource.vpc;
  };

  VPCGatewayAttachment = () => {
    this.CheckCreated('vpc', 'internetGateway');
    this.resource.vpcGatewayAttachment = new aws.ec2.InternetGatewayAttachment(
      'VPCGatewayAttachment',
      {
        internetGatewayId: this.resource.internetGateway.id,
        vpcId: this.resource.vpc.id,
      },
    );
    return this.resource.vpcGatewayAttachment;
  };
}

export default EC2;
