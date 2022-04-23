import * as aws from '@pulumi/aws';

const Vpc = (StackName: string) => (
  {
    VPC: new aws.ec2.Vpc(
      'VPC',
      {
        cidrBlock: '192.168.0.0/16',
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: { Name: `${StackName}/VPC` },
      },
    ),
  }
);

const SecurityGroup = (StackName: string, VPC: aws.ec2.Vpc) => (
  {
    ClusterSharedNodeSecurityGroup: new aws.ec2.SecurityGroup(
      'ClusterSharedNodeSecurityGroup',
      {
        description: 'Communication between all nodes in the cluster',
        tags: { Name: `${StackName}/ClusterSharedNodeSecurityGroup` },
        vpcId: VPC.id,
      },
    ),
    ControlPlaneSecurityGroup: new aws.ec2.SecurityGroup(
      'ControlPlaneSecurityGroup',
      {
        description: 'Communication between the control plane and worker nodegroups',
        tags: { Name: `${StackName}/ControlPlaneSecurityGroup` },
        vpcId: VPC.id,
      },
    ),
  }
);

const Subnet = (
  stackName: string,
  vpc: aws.ec2.Vpc,
  availabilityZones: Promise<aws.GetAvailabilityZonesResult>,
) => (
  {
    SubnetPrivateAPSOUTHEAST1A: new aws.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1A',
      {
        availabilityZone: availabilityZones.then((a) => a.names[0]),
        cidrBlock: '192.168.128.0/19',
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          'kubernetes.io/cluster/cluster-1': 'owned',
          Name: `${stackName}/SubnetPrivateAPSOUTHEAST1A`,
        },
        vpcId: vpc.id,
      },
    ),
    SubnetPrivateAPSOUTHEAST1B: new aws.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1B',
      {
        availabilityZone: availabilityZones.then((a) => a.names[1]),
        cidrBlock: '192.168.160.0/19',
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          'kubernetes.io/cluster/cluster-1': 'owned',
          Name: `${stackName}/SubnetPrivateAPSOUTHEAST1B`,
        },
        vpcId: vpc.id,
      },
    ),
    SubnetPrivateAPSOUTHEAST1C: new aws.ec2.Subnet(
      'SubnetPrivateAPSOUTHEAST1C',
      {
        availabilityZone: availabilityZones.then((a) => a.names[2]),
        cidrBlock: '192.168.96.0/19',
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          'kubernetes.io/cluster/cluster-1': 'owned',
          Name: `${stackName}/SubnetPrivateAPSOUTHEAST1C`,
        },
        vpcId: vpc.id,
      },
    ),
    SubnetPublicAPSOUTHEAST1A: new aws.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1A',
      {
        availabilityZone: availabilityZones.then((a) => a.names[0]),
        cidrBlock: '192.168.32.0/19',
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          'kubernetes.io/cluster/cluster-1': 'owned',
          Name: `${stackName}/SubnetPublicAPSOUTHEAST1A`,
        },
        vpcId: vpc.id,
      },
    ),
    SubnetPublicAPSOUTHEAST1B: new aws.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1B',
      {
        availabilityZone: availabilityZones.then((a) => a.names[1]),
        cidrBlock: '192.168.64.0/19',
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          'kubernetes.io/cluster/cluster-1': 'owned',
          Name: `${stackName}/SubnetPublicAPSOUTHEAST1B`,
        },
        vpcId: vpc.id,
      },
    ),
    SubnetPublicAPSOUTHEAST1C: new aws.ec2.Subnet(
      'SubnetPublicAPSOUTHEAST1C',
      {
        availabilityZone: availabilityZones.then((a) => a.names[2]),
        cidrBlock: '192.168.0.0/19',
        tags: {
          'kubernetes.io/role/internal-elb': '1',
          'kubernetes.io/cluster/cluster-1': 'owned',
          Name: `${stackName}/SubnetPublicAPSOUTHEAST1C`,
        },
        vpcId: vpc.id,
      },
    ),
  }
);

const SecurityGroupRule = (
  clusterSharedNodeSecurityGroup: aws.ec2.SecurityGroup,
  controlPlane: aws.eks.Cluster,
) => (
  {
    IngressDefaultClusterToNodeSG: new aws.ec2.SecurityGroupRule(
      'IngressDefaultClusterToNodeSG',
      {
        type: 'ingress',
        description: 'Allow managed and unmanaged nodes to communicate with each other (all'
          + ' ports)',
        fromPort: 0,
        securityGroupId: clusterSharedNodeSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: controlPlane.vpcConfig.clusterSecurityGroupId,
        toPort: 65535,
      },
    ),
    IngressInterNodeGroupSG: new aws.ec2.SecurityGroupRule(
      'IngressInterNodeGroupSG',
      {
        type: 'ingress',
        description: 'Allow nodes to communicate with each other (all ports)',
        fromPort: 0,
        securityGroupId: clusterSharedNodeSecurityGroup.id,
        protocol: '-1',
        sourceSecurityGroupId: clusterSharedNodeSecurityGroup.id,
        toPort: 65535,
      },
    ),
    IngressNodeToDefaultClusterSG: new aws.ec2.SecurityGroupRule(
      'IngressNodeToDefaultClusterSG',
      {
        type: 'ingress',
        description: 'Allow unmanaged nodes to communicate with control plane (all ports)',
        fromPort: 0,
        securityGroupId: controlPlane.vpcConfig.clusterSecurityGroupId,
        protocol: '-1',
        sourceSecurityGroupId: clusterSharedNodeSecurityGroup.id,
        toPort: 65535,
      },
    ),
  }
);

const InternetGateway = (stackName: string) => (
  {
    InternetGateway: new aws.ec2.InternetGateway(
      'InternetGateway',
      {
        tags: { Name: `${stackName}/InternetGateway` },
      },
    ),
  }
);

const Eip = (stackName: string) => (
  {
    NATIP: new aws.ec2.Eip(
      'NATIP',
      {
        vpc: true,
        tags: { Name: `${stackName}/NATIP` },
      },
    ),
  }
);

const NatGateway = (
  stackName: string,
  natip: aws.ec2.Eip,
  subnetPublicAPSOUTHEAST1C: aws.ec2.Subnet,
) => (
  {
    NATGateway: new aws.ec2.NatGateway(
      'NATGateway',
      {
        allocationId: natip.id,
        subnetId: subnetPublicAPSOUTHEAST1C.id,
        tags: { Name: `${stackName}/NATGateway` },
      },
    ),
  }
);

const RouteTable = (stackName: string, vpc: aws.ec2.Vpc) => (
  {
    PrivateRouteTableAPSOUTHEAST1A: new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1A',
      {
        tags: { Name: `${stackName}/PrivateRouteTableAPSOUTHEAST1A` },
        vpcId: vpc.id,
      },
    ),
    PrivateRouteTableAPSOUTHEAST1B: new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1B',
      {
        tags: { Name: `${stackName}/PrivateRouteTableAPSOUTHEAST1B` },
        vpcId: vpc.id,
      },
    ),
    PrivateRouteTableAPSOUTHEAST1C: new aws.ec2.RouteTable(
      'PrivateRouteTableAPSOUTHEAST1C',
      {
        tags: { Name: `${stackName}/PrivateRouteTableAPSOUTHEAST1C` },
        vpcId: vpc.id,
      },
    ),
    PublicRouteTable: new aws.ec2.RouteTable(
      'PublicRouteTable',
      {
        tags: { Name: `${stackName}/PublicRouteTable` },
        vpcId: vpc.id,
      },
    ),
  }
);

const Route = (
  natGateway: aws.ec2.NatGateway,
  privateRouteTableAPSOUTHEAST1A: aws.ec2.RouteTable,
  privateRouteTableAPSOUTHEAST1B: aws.ec2.RouteTable,
  privateRouteTableAPSOUTHEAST1C: aws.ec2.RouteTable,
  internetGateway: aws.ec2.InternetGateway,
  publicRouteTable: aws.ec2.RouteTable,
  vpcGatewayAttachment: aws.ec2.InternetGatewayAttachment,
) => (
  {
    NATPrivateSubnetRouteAPSOUTHEAST1A: new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1A',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: natGateway.id,
        routeTableId: privateRouteTableAPSOUTHEAST1A.id,
      },
    ),
    NATPrivateSubnetRouteAPSOUTHEAST1B: new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1B',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: natGateway.id,
        routeTableId: privateRouteTableAPSOUTHEAST1B.id,
      },
    ),
    NATPrivateSubnetRouteAPSOUTHEAST1C: new aws.ec2.Route(
      'NATPrivateSubnetRouteAPSOUTHEAST1C',
      {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: natGateway.id,
        routeTableId: privateRouteTableAPSOUTHEAST1C.id,
      },
    ),
    PublicSubnetRoute: new aws.ec2.Route(
      'PublicSubnetRoute',
      {
        destinationCidrBlock: '0.0.0.0/0',
        gatewayId: internetGateway.id,
        routeTableId: publicRouteTable.id,
      },
      {
        dependsOn: [vpcGatewayAttachment],
      },
    ),
  }
);

const InternetGatewayAttachment = (
  internetGateway: aws.ec2.InternetGateway,
  vpc: aws.ec2.Vpc,
) => (
  {
    VPCGatewayAttachment: new aws.ec2.InternetGatewayAttachment(
      'VPCGatewayAttachment',
      {
        internetGatewayId: internetGateway.id,
        vpcId: vpc.id,
      },
    ),
  }
);

const RouteTableAssociation = (
  privateRouteTableAPSOUTHEAST1A: aws.ec2.RouteTable,
  privateRouteTableAPSOUTHEAST1B: aws.ec2.RouteTable,
  privateRouteTableAPSOUTHEAST1C: aws.ec2.RouteTable,
  publicRouteTable: aws.ec2.RouteTable,
  subnetPrivateAPSOUTHEAST1A: aws.ec2.Subnet,
  subnetPrivateAPSOUTHEAST1B: aws.ec2.Subnet,
  subnetPrivateAPSOUTHEAST1C: aws.ec2.Subnet,
  subnetPublicAPSOUTHEAST1A: aws.ec2.Subnet,
  subnetPublicAPSOUTHEAST1B: aws.ec2.Subnet,
  subnetPublicAPSOUTHEAST1C: aws.ec2.Subnet,
) => (
  {
    RouteTableAssociationPrivateAPSOUTHEAST1A: new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPrivateAPSOUTHEAST1A',
      {
        routeTableId: privateRouteTableAPSOUTHEAST1A.id,
        subnetId: subnetPrivateAPSOUTHEAST1A.id,
      },
    ),
    RouteTableAssociationPrivateAPSOUTHEAST1B: new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPrivateAPSOUTHEAST1B',
      {
        routeTableId: privateRouteTableAPSOUTHEAST1B.id,
        subnetId: subnetPrivateAPSOUTHEAST1B.id,
      },
    ),
    RouteTableAssociationPrivateAPSOUTHEAST1C: new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPrivateAPSOUTHEAST1C',
      {
        routeTableId: privateRouteTableAPSOUTHEAST1C.id,
        subnetId: subnetPrivateAPSOUTHEAST1C.id,
      },
    ),
    RouteTableAssociationPublicAPSOUTHEAST1A: new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1A',
      {
        routeTableId: publicRouteTable.id,
        subnetId: subnetPublicAPSOUTHEAST1A.id,
      },
    ),
    RouteTableAssociationPublicAPSOUTHEAST1B: new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1B',
      {
        routeTableId: publicRouteTable.id,
        subnetId: subnetPublicAPSOUTHEAST1B.id,
      },
    ),
    RouteTableAssociationPublicAPSOUTHEAST1C: new aws.ec2.RouteTableAssociation(
      'RouteTableAssociationPublicAPSOUTHEAST1C',
      {
        routeTableId: publicRouteTable.id,
        subnetId: subnetPublicAPSOUTHEAST1C.id,
      },
    ),
  }
);

export {
  Vpc,
  SecurityGroup,
  Subnet,
  SecurityGroupRule,
  InternetGateway,
  Eip,
  NatGateway,
  RouteTable,
  Route,
  InternetGatewayAttachment,
  RouteTableAssociation,
};
