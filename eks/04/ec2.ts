import * as aws from '@pulumi/aws';
import Parameters from './param';

class EC2 extends Parameters {
  ClusterSharedNodeSecurityGroup = () => {
    this.CheckCreated('vpc');
    this.clusterSharedNodeSecurityGroup = new aws.ec2.SecurityGroup(
      'ClusterSharedNodeSecurityGroup',
      {
        description: 'Communication between all nodes in the cluster',
        tags: { Name: `${this.StackName}/ClusterSharedNodeSecurityGroup` },
        vpcId: this.vpc.id,
      },
    );
    return this.clusterSharedNodeSecurityGroup;
  };

  ControlPlaneSecurityGroup = () => {
    this.CheckCreated('vpc');
    this.controlPlaneSecurityGroup = new aws.ec2.SecurityGroup(
      'ControlPlaneSecurityGroup',
      {
        description: 'Communication between the control plane and worker nodegroups',
        tags: { Name: `${this.StackName}/ControlPlaneSecurityGroup` },
        vpcId: this.vpc.id,
      },
    );
    return this.controlPlaneSecurityGroup;
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
        securityGroupId: this.clusterSharedNodeSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: this.controlPlane.vpcConfig.clusterSecurityGroupId,
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
        securityGroupId: this.clusterSharedNodeSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: this.clusterSharedNodeSecurityGroup.id,
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
        securityGroupId: this.controlPlane.vpcConfig.clusterSecurityGroupId,
        protocol: '-1',
        sourceSecurityGroupId: this.clusterSharedNodeSecurityGroup.id,
        toPort: 65535,
      },
    );
  };

  InternetGateway = () => {
    this.internetGateway = new aws.ec2.InternetGateway(
      'InternetGateway',
      {
        tags: { Name: `${this.StackName}/InternetGateway` },
      },
    );
    return this.internetGateway;
  };

  NATGateway = () => {
    this.CheckCreated('natip', 'subnetPublicAPSOUTHEAST1A');
    this.natGateway = new aws.ec2.NatGateway(
      'NATGateway',
      {
        allocationId: this.natip.id,
        subnetId: this.subnetPublicAPSOUTHEAST1A.id,
        tags: { Name: `${this.StackName}/NATGateway` },
      },
    );
    return this.natGateway;
  };

  NATIP = () => {
    this.natip = new aws.ec2.Eip(
      'NATIP',
      {
        vpc: true,
        tags: { Name: `${this.StackName}/NATIP` },
      },
    );
    return this.natip;
  };

  NATPrivateSubnetRouteAPSOUTHEAST1A = () => {
    this.CheckCreated('natGateway', 'privateRouteTableAPSOUTHEAST1A');
    return new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1A',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.natGateway.id,
        routeTableId: this.privateRouteTableAPSOUTHEAST1A.id,
      },
    );
  };

  NATPrivateSubnetRouteAPSOUTHEAST1B = () => {
    this.CheckCreated('natGateway', 'privateRouteTableAPSOUTHEAST1B');
    return new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1B',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.natGateway.id,
        routeTableId: this.privateRouteTableAPSOUTHEAST1B.id,
      },
    );
  };

  NATPrivateSubnetRouteAPSOUTHEAST1C = () => {
    this.CheckCreated('natGateway', 'privateRouteTableAPSOUTHEAST1C');
    return new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1C',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: this.natGateway.id,
        routeTableId: this.privateRouteTableAPSOUTHEAST1C.id,
      },
    );
  };

  PublicRouteTable = () => {
    this.CheckCreated('vpc');
    this.publicRouteTable = new aws.ec2.RouteTable(
      'PublicRouteTable',
      {
        tags: { Name: `${this.StackName}/PublicRouteTable` },
        vpcId: this.vpc.id,
      },
    );
    return this.publicRouteTable;
  };

  PrivateRouteTableAPSOUTHEAST1A = () => {
    this.CheckCreated('vpc');
    this.privateRouteTableAPSOUTHEAST1A = new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1A',
      {
        tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1A` },
        vpcId: this.vpc.id,
      },
    );
    return this.privateRouteTableAPSOUTHEAST1A;
  };

  PrivateRouteTableAPSOUTHEAST1B = () => {
    this.CheckCreated('vpc');
    this.privateRouteTableAPSOUTHEAST1B = new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1B',
      {
        tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1B` },
        vpcId: this.vpc.id,
      },
    );
    return this.privateRouteTableAPSOUTHEAST1B;
  };

  PrivateRouteTableAPSOUTHEAST1C = () => {
    this.CheckCreated('vpc');
    this.privateRouteTableAPSOUTHEAST1C = new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1C',
      {
        tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1C` },
        vpcId: this.vpc.id,
      },
    );
    return this.privateRouteTableAPSOUTHEAST1C;
  };

  PublicSubnetIPv6DefaultRoute = () => {
    this.CheckCreated(
      'internetGateway',
      'publicRouteTable',
      'vpcGatewayAttachment',
    );
    return new aws.ec2.Route(
      'PublicSubnetIPv6DefaultRoute',
      {
        destinationIpv6CidrBlock: '::/0',
        gatewayId: this.internetGateway.id,
        routeTableId: this.publicRouteTable.id,
      },
      { dependsOn: [this.vpcGatewayAttachment] },
    );
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
        gatewayId: this.internetGateway.id,
        routeTableId: this.publicRouteTable.id,
      },
      { dependsOn: [this.vpcGatewayAttachment] },
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
        routeTableId: this.privateRouteTableAPSOUTHEAST1A.id,
        subnetId: this.subnetPrivateAPSOUTHEAST1A.id,
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
        routeTableId: this.privateRouteTableAPSOUTHEAST1B.id,
        subnetId: this.subnetPrivateAPSOUTHEAST1B.id,
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
        routeTableId: this.privateRouteTableAPSOUTHEAST1C.id,
        subnetId: this.subnetPrivateAPSOUTHEAST1C.id,
      },
    );
  };

  RouteTableAssociationPublicAPSOUTHEAST1A = () => {
    this.CheckCreated('publicRouteTable', 'subnetPublicAPSOUTHEAST1A');
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1A',
      {
        routeTableId: this.publicRouteTable.id,
        subnetId: this.subnetPublicAPSOUTHEAST1A.id,
      },
    );
  };

  RouteTableAssociationPublicAPSOUTHEAST1B = () => {
    this.CheckCreated('publicRouteTable', 'subnetPublicAPSOUTHEAST1B');
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1B',
      {
        routeTableId: this.publicRouteTable.id,
        subnetId: this.subnetPublicAPSOUTHEAST1B.id,
      },
    );
  };

  RouteTableAssociationPublicAPSOUTHEAST1C = () => {
    this.CheckCreated('publicRouteTable', 'subnetPublicAPSOUTHEAST1C');
    return new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1C',
      {
        routeTableId: this.publicRouteTable.id,
        subnetId: this.subnetPublicAPSOUTHEAST1C.id,
      },
    );
  };

  SubnetPrivateAPSOUTHEAST1A = () => {
    this.CheckCreated('vpc', 'cidr');
    this.subnetPrivateAPSOUTHEAST1A = new aws.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1A',
      {
        availabilityZone: this.AvailabilityZones()[0],
        cidrBlock: this.cidr.outputs.IPV40,
        ipv6CidrBlock: this.cidr.outputs.IPV60,
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SubnetPrivateAPSOUTHEAST1A`,
        },
        vpcId: this.vpc.id,
      },
    );
    return this.subnetPrivateAPSOUTHEAST1A;
  };

  SubnetPrivateAPSOUTHEAST1B = () => {
    this.CheckCreated('vpc', 'cidr');
    this.subnetPrivateAPSOUTHEAST1B = new aws.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1B',
      {
        availabilityZone: this.AvailabilityZones()[1],
        cidrBlock: this.cidr.outputs.IPV41,
        ipv6CidrBlock: this.cidr.outputs.IPV61,
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SubnetPrivateAPSOUTHEAST1B`,
        },
        vpcId: this.vpc.id,
      },
    );
    return this.subnetPrivateAPSOUTHEAST1B;
  };

  SubnetPrivateAPSOUTHEAST1C = () => {
    this.CheckCreated('vpc', 'cidr');
    this.subnetPrivateAPSOUTHEAST1C = new aws.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1C',
      {
        availabilityZone: this.AvailabilityZones()[2],
        cidrBlock: this.cidr.outputs.IPV42,
        ipv6CidrBlock: this.cidr.outputs.IPV62,
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SubnetPrivateAPSOUTHEAST1C`,
        },
        vpcId: this.vpc.id,
      },
    );
    return this.subnetPrivateAPSOUTHEAST1C;
  };

  SubnetPublicAPSOUTHEAST1A = () => {
    this.CheckCreated('vpc', 'cidr');
    this.subnetPublicAPSOUTHEAST1A = new aws.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1A',
      {
        mapPublicIpOnLaunch: true,
        availabilityZone: this.AvailabilityZones()[0],
        cidrBlock: this.cidr.outputs.IPV43,
        ipv6CidrBlock: this.cidr.outputs.IPV63,
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SubnetPublicAPSOUTHEAST1A`,
        },
        vpcId: this.vpc.id,
      },
    );
    return this.subnetPublicAPSOUTHEAST1A;
  };

  SubnetPublicAPSOUTHEAST1B = () => {
    this.CheckCreated('vpc', 'cidr');
    this.subnetPublicAPSOUTHEAST1B = new aws.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1B',
      {
        mapPublicIpOnLaunch: true,
        availabilityZone: this.AvailabilityZones()[1],
        cidrBlock: this.cidr.outputs.IPV44,
        ipv6CidrBlock: this.cidr.outputs.IPV64,
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SubnetPublicAPSOUTHEAST1B`,
        },
        vpcId: this.vpc.id,
      },
    );
    return this.subnetPublicAPSOUTHEAST1B;
  };

  SubnetPublicAPSOUTHEAST1C = () => {
    this.CheckCreated('vpc', 'cidr');
    this.subnetPublicAPSOUTHEAST1C = new aws.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1C',
      {
        mapPublicIpOnLaunch: true,
        availabilityZone: this.AvailabilityZones()[2],
        cidrBlock: this.cidr.outputs.IPV45,
        ipv6CidrBlock: this.cidr.outputs.IPV65,
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
          Name: `${this.StackName}/SubnetPublicAPSOUTHEAST1C`,
        },
        vpcId: this.vpc.id,
      },
    );
    return this.subnetPublicAPSOUTHEAST1C;
  };

  VPC = () => {
    this.vpc = new aws.ec2.Vpc(
      'VPC',
      {
        cidrBlock: '10.0.0.0/16',
        assignGeneratedIpv6CidrBlock: true,
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: { Name: `${this.StackName}/VPC` },
      },
    );
    return this.vpc;
  };

  VPCGatewayAttachment = () => {
    this.CheckCreated('vpc', 'internetGateway');
    this.vpcGatewayAttachment = new aws.ec2.InternetGatewayAttachment(
      'VPCGatewayAttachment',
      {
        internetGatewayId: this.internetGateway.id,
        vpcId: this.vpc.id,
      },
    );
    return this.vpcGatewayAttachment;
  };
}

export default EC2;
