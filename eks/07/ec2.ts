import * as aws from '@pulumi/aws';
import Parameters from './param';

class EC2 extends Parameters {
  CIDR: aws.cloudformation.Stack | null = null;

  clusterSharedNodeSecurityGroup: aws.ec2.SecurityGroup | null = null;

  ControlPlane: aws.eks.Cluster | null = null;

  internetGateway: aws.ec2.InternetGateway | null = null;

  natGateway: aws.ec2.NatGateway | null = null;

  natip: aws.ec2.Eip | null = null;

  privateRouteTableAPSOUTHEAST1A: aws.ec2.RouteTable | null = null;

  privateRouteTableAPSOUTHEAST1B: aws.ec2.RouteTable | null = null;

  privateRouteTableAPSOUTHEAST1C: aws.ec2.RouteTable | null = null;

  publicRouteTable: aws.ec2.RouteTable | null = null;

  subnetPrivateAPSOUTHEAST1A: aws.ec2.Subnet | null = null;

  subnetPrivateAPSOUTHEAST1B: aws.ec2.Subnet | null = null;

  subnetPrivateAPSOUTHEAST1C: aws.ec2.Subnet | null = null;

  subnetPublicAPSOUTHEAST1A: aws.ec2.Subnet | null = null;

  subnetPublicAPSOUTHEAST1B: aws.ec2.Subnet | null = null;

  subnetPublicAPSOUTHEAST1C: aws.ec2.Subnet | null = null;

  vpc: aws.ec2.Vpc | null = null;

  vpcGatewayAttachment: aws.ec2.InternetGatewayAttachment | null = null;

  ClusterSharedNodeSecurityGroup = () => {
    if (this.vpc) {
      this.clusterSharedNodeSecurityGroup = new aws.ec2.SecurityGroup(
        'ClusterSharedNodeSecurityGroup',
        {
          description: 'Communication between all nodes in the cluster',
          tags: { Name: `${this.StackName}/ClusterSharedNodeSecurityGroup` },
          vpcId: this.vpc.id,
        },
      );
      return this.clusterSharedNodeSecurityGroup;
    }
    throw new Error(`vpc = ${this.vpc}`);
  };

  ControlPlaneSecurityGroup = () => {
    if (this.vpc) {
      return new aws.ec2.SecurityGroup(
        'ControlPlaneSecurityGroup',
        {
          description: 'Communication between the control plane and worker nodegroups',
          tags: { Name: `${this.StackName}/ControlPlaneSecurityGroup` },
          vpcId: this.vpc.id,
        },
      );
    }
    throw new Error(`vpc = ${this.vpc}`);
  };

  IngressDefaultClusterToNodeSG = () => {
    if (this.clusterSharedNodeSecurityGroup && this.ControlPlane) {
      return new aws.ec2.SecurityGroupRule(
        'IngressDefaultClusterToNodeSG',
        {
          type: 'ingress',
          description: 'Allow managed and unmanaged nodes to communicate with each other (all'
            + ' ports)',
          fromPort: 0,
          securityGroupId: this.clusterSharedNodeSecurityGroup.id,
          protocol: '-1',
          sourceSecurityGroupId: this.ControlPlane.vpcConfig.clusterSecurityGroupId,
          toPort: 65535,
        },
      );
    }
    throw new Error(`
    clusterSharedNodeSecurityGroup = ${this.clusterSharedNodeSecurityGroup}
    ControlPlane = ${this.ControlPlane}
    `);
  };

  IngressInterNodeGroupSG = () => {
    if (this.clusterSharedNodeSecurityGroup) {
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
    }
    throw new Error(`
    clusterSharedNodeSecurityGroup = ${this.clusterSharedNodeSecurityGroup}
    `);
  };

  IngressNodeToDefaultClusterSG = () => {
    if (this.clusterSharedNodeSecurityGroup && this.ControlPlane) {
      return new aws.ec2.SecurityGroupRule(
        'IngressNodeToDefaultClusterSG',
        {
          type: 'ingress',
          description: 'Allow unmanaged nodes to communicate with control plane (all ports)',
          fromPort: 0,
          securityGroupId: this.ControlPlane.vpcConfig.clusterSecurityGroupId,
          protocol: '-1',
          sourceSecurityGroupId: this.clusterSharedNodeSecurityGroup.id,
          toPort: 65535,
        },
      );
    }
    throw new Error(`
    clusterSharedNodeSecurityGroup = ${this.clusterSharedNodeSecurityGroup}
    ControlPlane = ${this.ControlPlane}
    `);
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
    if (this.natip && this.subnetPublicAPSOUTHEAST1A) {
      this.natGateway = new aws.ec2.NatGateway(
        'NATGateway',
        {
          allocationId: this.natip.id,
          subnetId: this.subnetPublicAPSOUTHEAST1A.id,
          tags: { Name: `${this.StackName}/NATGateway` },
        },
      );
      return this.natGateway;
    }
    throw new Error(`
    natip = ${this.natip}
    subnetPublicAPSOUTHEAST1A = ${this.subnetPublicAPSOUTHEAST1A}
    `);
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
    if (this.natGateway && this.privateRouteTableAPSOUTHEAST1A) {
      return new aws.ec2.Route(
        'NATPrivateSubnetRouteAPSOUTHEAST1A',
        {
          destinationCidrBlock: '0.0.0.0/0',
          natGatewayId: this.natGateway.id,
          routeTableId: this.privateRouteTableAPSOUTHEAST1A.id,
        },
      );
    }
    throw new Error(`
    natGateway = ${this.natGateway}
    privateRouteTableAPSOUTHEAST1A = ${this.privateRouteTableAPSOUTHEAST1A}
    `);
  };

  NATPrivateSubnetRouteAPSOUTHEAST1B = () => {
    if (this.natGateway && this.privateRouteTableAPSOUTHEAST1B) {
      return new aws.ec2.Route(
        'NATPrivateSubnetRouteAPSOUTHEAST1B',
        {
          destinationCidrBlock: '0.0.0.0/0',
          natGatewayId: this.natGateway.id,
          routeTableId: this.privateRouteTableAPSOUTHEAST1B.id,
        },
      );
    }
    throw new Error(`
    natGateway = ${this.natGateway}
    privateRouteTableAPSOUTHEAST1B = ${this.privateRouteTableAPSOUTHEAST1B}
    `);
  };

  NATPrivateSubnetRouteAPSOUTHEAST1C = () => {
    if (this.natGateway && this.privateRouteTableAPSOUTHEAST1C) {
      return new aws.ec2.Route(
        'NATPrivateSubnetRouteAPSOUTHEAST1C',
        {
          destinationCidrBlock: '0.0.0.0/0',
          natGatewayId: this.natGateway.id,
          routeTableId: this.privateRouteTableAPSOUTHEAST1C.id,
        },
      );
    }
    throw new Error(`
    natGateway = ${this.natGateway}
    privateRouteTableAPSOUTHEAST1C = ${this.privateRouteTableAPSOUTHEAST1C}
    `);
  };

  PrivateRouteTableAPSOUTHEAST1A = () => {
    if (this.vpc) {
      this.privateRouteTableAPSOUTHEAST1A = new aws.ec2.RouteTable(
        'PrivateRouteTableAPSOUTHEAST1A',
        {
          tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1A` },
          vpcId: this.vpc.id,
        },
      );
      return this.privateRouteTableAPSOUTHEAST1A;
    }
    throw new Error(`vpc = ${this.vpc}`);
  };

  PrivateRouteTableAPSOUTHEAST1B = () => {
    if (this.vpc) {
      this.privateRouteTableAPSOUTHEAST1B = new aws.ec2.RouteTable(
        'PrivateRouteTableAPSOUTHEAST1B',
        {
          tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1B` },
          vpcId: this.vpc.id,
        },
      );
      return this.privateRouteTableAPSOUTHEAST1B;
    }
    throw new Error(`vpc = ${this.vpc}`);
  };

  PrivateRouteTableAPSOUTHEAST1C = () => {
    if (this.vpc) {
      this.privateRouteTableAPSOUTHEAST1C = new aws.ec2.RouteTable(
        'PrivateRouteTableAPSOUTHEAST1C',
        {
          tags: { Name: `${this.StackName}/PrivateRouteTableAPSOUTHEAST1C` },
          vpcId: this.vpc.id,
        },
      );
      return this.privateRouteTableAPSOUTHEAST1C;
    }
    throw new Error(`vpc = ${this.vpc}`);
  };

  PublicSubnetIPv6DefaultRoute = () => {
    if (
      this.internetGateway
      && this.publicRouteTable
      && this.vpcGatewayAttachment
    ) {
      return new aws.ec2.Route(
        'PublicSubnetIPv6DefaultRoute',
        {
          destinationIpv6CidrBlock: '::/0',
          gatewayId: this.internetGateway.id,
          routeTableId: this.publicRouteTable.id,
        },
        { dependsOn: [this.vpcGatewayAttachment] },
      );
    }
    throw new Error(`
    internetGateway = ${this.internetGateway}
    publicRouteTable = ${this.publicRouteTable}
    vpcGatewayAttachment = ${this.vpcGatewayAttachment}
    `);
  };

  PublicRouteTable = () => {
    if (this.vpc) {
      this.publicRouteTable = new aws.ec2.RouteTable(
        'PublicRouteTable',
        {
          tags: { Name: `${this.StackName}/PublicRouteTable` },
          vpcId: this.vpc.id,
        },
      );
      return this.publicRouteTable;
    }
    throw new Error(`vpc = ${this.vpc}`);
  };

  PublicSubnetRoute = () => {
    if (
      this.internetGateway
      && this.publicRouteTable
      && this.vpcGatewayAttachment
    ) {
      return new aws.ec2.Route(
        'PublicSubnetRoute',
        {
          destinationCidrBlock: '0.0.0.0/0',
          gatewayId: this.internetGateway.id,
          routeTableId: this.publicRouteTable.id,
        },
        { dependsOn: [this.vpcGatewayAttachment] },
      );
    }
    throw new Error(`
    internetGateway = ${this.internetGateway}
    publicRouteTable = ${this.publicRouteTable}
    vpcGatewayAttachment = ${this.vpcGatewayAttachment}
    `);
  };

  RouteTableAssociationPrivateAPSOUTHEAST1A = () => {
    if (
      this.privateRouteTableAPSOUTHEAST1A
      && this.subnetPrivateAPSOUTHEAST1A
    ) {
      return new aws.ec2.RouteTableAssociation(
        'RouteTableAssociationPrivateAPSOUTHEAST1A',
        {
          routeTableId: this.privateRouteTableAPSOUTHEAST1A.id,
          subnetId: this.subnetPrivateAPSOUTHEAST1A.id,
        },
      );
    }
    throw new Error(`
    privateRouteTableAPSOUTHEAST1A = ${this.privateRouteTableAPSOUTHEAST1A}
    subnetPrivateAPSOUTHEAST1A = ${this.subnetPrivateAPSOUTHEAST1A}
    `);
  };

  RouteTableAssociationPrivateAPSOUTHEAST1B = () => {
    if (
      this.privateRouteTableAPSOUTHEAST1B
      && this.subnetPrivateAPSOUTHEAST1B
    ) {
      return new aws.ec2.RouteTableAssociation(
        'RouteTableAssociationPrivateAPSOUTHEAST1B',
        {
          routeTableId: this.privateRouteTableAPSOUTHEAST1B.id,
          subnetId: this.subnetPrivateAPSOUTHEAST1B.id,
        },
      );
    }
    throw new Error(`
    privateRouteTableAPSOUTHEAST1B = ${this.privateRouteTableAPSOUTHEAST1B}
    subnetPrivateAPSOUTHEAST1B = ${this.subnetPrivateAPSOUTHEAST1B}
    `);
  };

  RouteTableAssociationPrivateAPSOUTHEAST1C = () => {
    if (
      this.privateRouteTableAPSOUTHEAST1C
      && this.subnetPrivateAPSOUTHEAST1C
    ) {
      return new aws.ec2.RouteTableAssociation(
        'RouteTableAssociationPrivateAPSOUTHEAST1C',
        {
          routeTableId: this.privateRouteTableAPSOUTHEAST1C.id,
          subnetId: this.subnetPrivateAPSOUTHEAST1C.id,
        },
      );
    }
    throw new Error(`
    privateRouteTableAPSOUTHEAST1C = ${this.privateRouteTableAPSOUTHEAST1C}
    subnetPrivateAPSOUTHEAST1C = ${this.subnetPrivateAPSOUTHEAST1C}
    `);
  };

  RouteTableAssociationPublicAPSOUTHEAST1A = () => {
    if (this.publicRouteTable && this.subnetPublicAPSOUTHEAST1A) {
      return new aws.ec2.RouteTableAssociation(
        'RouteTableAssociationPublicAPSOUTHEAST1A',
        {
          routeTableId: this.publicRouteTable.id,
          subnetId: this.subnetPublicAPSOUTHEAST1A.id,
        },
      );
    }
    throw new Error(`
    publicRouteTable = ${this.publicRouteTable}
    subnetPublicAPSOUTHEAST1A = ${this.subnetPublicAPSOUTHEAST1A}
    `);
  };

  RouteTableAssociationPublicAPSOUTHEAST1B = () => {
    if (this.publicRouteTable && this.subnetPublicAPSOUTHEAST1B) {
      return new aws.ec2.RouteTableAssociation(
        'RouteTableAssociationPublicAPSOUTHEAST1B',
        {
          routeTableId: this.publicRouteTable.id,
          subnetId: this.subnetPublicAPSOUTHEAST1B.id,
        },
      );
    }
    throw new Error(`
    publicRouteTable = ${this.publicRouteTable}
    subnetPublicAPSOUTHEAST1B = ${this.subnetPublicAPSOUTHEAST1B}
    `);
  };

  RouteTableAssociationPublicAPSOUTHEAST1C = () => {
    if (this.publicRouteTable && this.subnetPublicAPSOUTHEAST1C) {
      return new aws.ec2.RouteTableAssociation(
        'RouteTableAssociationPublicAPSOUTHEAST1C',
        {
          routeTableId: this.publicRouteTable.id,
          subnetId: this.subnetPublicAPSOUTHEAST1C.id,
        },
      );
    }
    throw new Error(`
    publicRouteTable = ${this.publicRouteTable}
    subnetPublicAPSOUTHEAST1C = ${this.subnetPublicAPSOUTHEAST1C}
    `);
  };

  SubnetPrivateAPSOUTHEAST1A = () => {
    if (this.vpc && this.CIDR) {
      this.subnetPrivateAPSOUTHEAST1A = new aws.ec2.Subnet(
        'SubnetPrivateAPSOUTHEAST1A',
        {
          availabilityZone: this.AvailabilityZones[0],
          cidrBlock: this.CIDR.outputs.IPV40,
          ipv6CidrBlock: this.CIDR.outputs.IPV60,
          tags: {
            'kubernetes.io/role/internal-elb': '1',
            [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
            Name: `${this.StackName}/SubnetPrivateAPSOUTHEAST1A`,
          },
          vpcId: this.vpc.id,
        },
      );
      return this.subnetPrivateAPSOUTHEAST1A;
    }
    throw new Error(`
    vpc = ${this.vpc}
    CIDR = ${this.CIDR}
    `);
  };

  SubnetPrivateAPSOUTHEAST1B = () => {
    if (this.vpc && this.CIDR) {
      this.subnetPrivateAPSOUTHEAST1B = new aws.ec2.Subnet(
        'SubnetPrivateAPSOUTHEAST1B',
        {
          availabilityZone: this.AvailabilityZones[1],
          cidrBlock: this.CIDR.outputs.IPV41,
          ipv6CidrBlock: this.CIDR.outputs.IPV61,
          tags: {
            'kubernetes.io/role/internal-elb': '1',
            [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
            Name: `${this.StackName}/SubnetPrivateAPSOUTHEAST1B`,
          },
          vpcId: this.vpc.id,
        },
      );
      return this.subnetPrivateAPSOUTHEAST1B;
    }
    throw new Error(`
    vpc = ${this.vpc}
    CIDR = ${this.CIDR}
    `);
  };

  SubnetPrivateAPSOUTHEAST1C = () => {
    if (this.vpc && this.CIDR) {
      this.subnetPrivateAPSOUTHEAST1C = new aws.ec2.Subnet(
        'SubnetPrivateAPSOUTHEAST1C',
        {
          availabilityZone: this.AvailabilityZones[2],
          cidrBlock: this.CIDR.outputs.IPV42,
          ipv6CidrBlock: this.CIDR.outputs.IPV62,
          tags: {
            'kubernetes.io/role/internal-elb': '1',
            [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
            Name: `${this.StackName}/SubnetPrivateAPSOUTHEAST1C`,
          },
          vpcId: this.vpc.id,
        },
      );
      return this.subnetPrivateAPSOUTHEAST1C;
    }
    throw new Error(`
    vpc = ${this.vpc}
    CIDR = ${this.CIDR}
    `);
  };

  SubnetPublicAPSOUTHEAST1A = () => {
    if (this.vpc && this.CIDR) {
      this.subnetPublicAPSOUTHEAST1A = new aws.ec2.Subnet(
        'SubnetPublicAPSOUTHEAST1A',
        {
          mapPublicIpOnLaunch: true,
          availabilityZone: this.AvailabilityZones[0],
          cidrBlock: this.CIDR.outputs.IPV43,
          ipv6CidrBlock: this.CIDR.outputs.IPV63,
          tags: {
            'kubernetes.io/role/internal-elb': '1',
            [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
            Name: `${this.StackName}/SubnetPublicAPSOUTHEAST1A`,
          },
          vpcId: this.vpc.id,
        },
      );
      return this.subnetPublicAPSOUTHEAST1A;
    }
    throw new Error(`
    vpc = ${this.vpc}
    CIDR = ${this.CIDR}
    `);
  };

  SubnetPublicAPSOUTHEAST1B = () => {
    if (this.vpc && this.CIDR) {
      this.subnetPublicAPSOUTHEAST1B = new aws.ec2.Subnet(
        'SubnetPublicAPSOUTHEAST1B',
        {
          mapPublicIpOnLaunch: true,
          availabilityZone: this.AvailabilityZones[1],
          cidrBlock: this.CIDR.outputs.IPV44,
          ipv6CidrBlock: this.CIDR.outputs.IPV64,
          tags: {
            'kubernetes.io/role/internal-elb': '1',
            [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
            Name: `${this.StackName}/SubnetPublicAPSOUTHEAST1B`,
          },
          vpcId: this.vpc.id,
        },
      );
      return this.subnetPublicAPSOUTHEAST1B;
    }
    throw new Error(`
    vpc = ${this.vpc}
    CIDR = ${this.CIDR}
    `);
  };

  SubnetPublicAPSOUTHEAST1C = () => {
    if (this.vpc && this.CIDR) {
      this.subnetPublicAPSOUTHEAST1C = new aws.ec2.Subnet(
        'SubnetPublicAPSOUTHEAST1C',
        {
          mapPublicIpOnLaunch: true,
          availabilityZone: this.AvailabilityZones[2],
          cidrBlock: this.CIDR.outputs.IPV45,
          ipv6CidrBlock: this.CIDR.outputs.IPV65,
          tags: {
            'kubernetes.io/role/internal-elb': '1',
            [`kubernetes.io/cluster/${this.StackName}`]: 'owned',
            Name: `${this.StackName}/SubnetPublicAPSOUTHEAST1C`,
          },
          vpcId: this.vpc.id,
        },
      );
      return this.subnetPublicAPSOUTHEAST1C;
    }
    throw new Error(`
    vpc = ${this.vpc}
    CIDR = ${this.CIDR}
    `);
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
    if (this.vpc && this.internetGateway) {
      this.vpcGatewayAttachment = new aws.ec2.InternetGatewayAttachment(
        'VPCGatewayAttachment',
        {
          internetGatewayId: this.internetGateway.id,
          vpcId: this.vpc.id,
        },
      );
      return this.vpcGatewayAttachment;
    }
    throw new Error(`
    vpc = ${this.vpc}
    internetGateway = ${this.internetGateway}
    `);
  };
}

export default EC2;
