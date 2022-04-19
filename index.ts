import * as aws from '@pulumi/aws';

const StackName = 'cluster-1';

const VPC = new aws.ec2.Vpc('VPC', {
  cidrBlock: '192.168.0.0/16',
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: {
    Name: `${StackName}/VPC`,
  },
});

const ClusterSharedNodeSecurityGroup = new aws.ec2.SecurityGroup(
  'ClusterSharedNodeSecurityGroup',
  {
    description: 'Communication between all nodes in the cluster',
    vpcId: VPC.id,
    tags: {
      Name: `${StackName}/ClusterSharedNodeSecurityGroup`,
    },
  },
);

const ControlPlaneSecurityGroup = new aws.ec2.SecurityGroup(
  'ControlPlaneSecurityGroup',
  {
    description: 'Communication between the control plane and worker nodegroups',
    vpcId: VPC.id,
    tags: {
      Name: `${StackName}/ControlPlaneSecurityGroup`,
    },
  },
);

const SubnetPublicAPSOUTHEAST1C = new aws.ec2.Subnet(
  'SubnetPublicAPSOUTHEAST1C',
  {
    vpcId: VPC.id,
    availabilityZone: 'ap-southeast-1c',
    cidrBlock: '192.168.0.0/19',
    mapPublicIpOnLaunch: true,
    tags: {
      'kubernetes.io/role/elb': '1',
      Name: `${StackName}/SubnetPublicAPSOUTHEAST1C`,
    },
  },
);

const SubnetPublicAPSOUTHEAST1B = new aws.ec2.Subnet(
  'SubnetPublicAPSOUTHEAST1B',
  {
    vpcId: VPC.id,
    availabilityZone: 'ap-southeast-1b',
    cidrBlock: '192.168.32.0/19',
    mapPublicIpOnLaunch: true,
    tags: {
      'kubernetes.io/role/elb': '1',
      Name: `${StackName}/SubnetPublicAPSOUTHEAST1B`,
    },
  },
);

const SubnetPublicAPSOUTHEAST1A = new aws.ec2.Subnet(
  'SubnetPublicAPSOUTHEAST1A',
  {
    vpcId: VPC.id,
    availabilityZone: 'ap-southeast-1a',
    cidrBlock: '192.168.64.0/19',
    mapPublicIpOnLaunch: true,
    tags: {
      'kubernetes.io/role/elb': '1',
      Name: `${StackName}/SubnetPublicAPSOUTHEAST1A`,
    },
  },
);

const SubnetPrivateAPSOUTHEAST1C = new aws.ec2.Subnet('SubnetPrivateAPSOUTHEAST1C', {
  vpcId: VPC.id,
  availabilityZone: 'ap-southeast-1c',
  cidrBlock: '192.168.96.0/19',
  tags: {
    'kubernetes.io/role/internal-elb': '1',
    Name: `${StackName}/SubnetPrivateAPSOUTHEAST1C`,
  },
});

const SubnetPrivateAPSOUTHEAST1B = new aws.ec2.Subnet('SubnetPrivateAPSOUTHEAST1B', {
  vpcId: VPC.id,
  availabilityZone: 'ap-southeast-1b',
  cidrBlock: '192.168.128.0/19',
  tags: {
    'kubernetes.io/role/internal-elb': '1',
    Name: `${StackName}/SubnetPrivateAPSOUTHEAST1B`,
  },
});

const SubnetPrivateAPSOUTHEAST1A = new aws.ec2.Subnet('SubnetPrivateAPSOUTHEAST1A', {
  vpcId: VPC.id,
  availabilityZone: 'ap-southeast-1a',
  cidrBlock: '192.168.160.0/19',
  tags: {
    'kubernetes.io/role/internal-elb': '1',
    Name: `${StackName}/SubnetPrivateAPSOUTHEAST1A`,
  },
});

const PolicyCloudWatchMetrics = new aws.iam.Policy('PolicyCloudWatchMetrics', {
  name: `${StackName}-PolicyCloudWatchMetrics`,
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Action: [
        'cloudwatch:PutMetricData',
      ],
      Effect: 'Allow',
      Resource: '*',
    }],
  }),
});

const PolicyELBPermissions = new aws.iam.Policy('PolicyELBPermissions', {
  name: `${StackName}-PolicyELBPermissions`,
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Action: [
        'ec2:DescribeAccountAttributes',
        'ec2:DescribeAddresses',
        'ec2:DescribeInternetGateways',
      ],
      Effect: 'Allow',
      Resource: '*',
    }],
  }),
});

const ServiceRole = new aws.iam.Role('ServiceRole', {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Action: 'sts:AssumeRole',
      Effect: 'Allow',
      Principal: {
        Service: 'eks.amazonaws.com',
      },
    }],
  }),
  managedPolicyArns: [
    'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy',
    'arn:aws:iam::aws:policy/AmazonEKSVPCResourceController',
    PolicyCloudWatchMetrics.arn,
    PolicyELBPermissions.arn,
  ],
  tags: {
    Name: `${StackName}/ServiceRole`,
  },
});

const ControlPlane = new aws.eks.Cluster('ControlPlane', {
  kubernetesNetworkConfig: {},
  enabledClusterLogTypes: [
    'audit',
    'authenticator',
    'controllerManager',
  ],
  name: StackName,
  vpcConfig: {
    endpointPrivateAccess: false,
    endpointPublicAccess: true,
    securityGroupIds: [
      ControlPlaneSecurityGroup.id,
    ],
    subnetIds: [
      SubnetPublicAPSOUTHEAST1C.id,
      SubnetPublicAPSOUTHEAST1B.id,
      SubnetPublicAPSOUTHEAST1A.id,
      SubnetPrivateAPSOUTHEAST1C.id,
      SubnetPrivateAPSOUTHEAST1B.id,
      SubnetPrivateAPSOUTHEAST1A.id,
    ],
  },
  roleArn: ServiceRole.arn,
  tags: {
    Name: `${StackName}/ControlPlane`,
  },
  version: '1.21',
});

const IngressDefaultClusterToNodeSG = new aws.ec2.SecurityGroupRule(
  'IngressDefaultClusterToNodeSG',
  {
    description: 'Allow managed and unmanaged nodes to communicate with each other (all ports)',
    type: 'ingress',
    fromPort: 0,
    toPort: 65535,
    protocol: '-1',
    securityGroupId: ClusterSharedNodeSecurityGroup.id,
    sourceSecurityGroupId: ControlPlane.vpcConfig.clusterSecurityGroupId,
  },
);

const IngressInterNodeGroupSG = new aws.ec2.SecurityGroupRule(
  'IngressInterNodeGroupSG',
  {
    description: 'Allow nodes to communicate with each other (all ports)',
    type: 'ingress',
    fromPort: 0,
    toPort: 65535,
    protocol: '-1',
    securityGroupId: ClusterSharedNodeSecurityGroup.id,
    sourceSecurityGroupId: ClusterSharedNodeSecurityGroup.id,
  }
);

const IngressNodeToDefaultClusterSG = new aws.ec2.SecurityGroupRule('IngressNodeToDefaultClusterSG', {
  description: 'Allow unmanaged nodes to communicate with control plane (all ports)',
  type: 'ingress',
  fromPort: 0,
  toPort: 65535,
  protocol: '-1',
  securityGroupId: ControlPlane.vpcConfig.clusterSecurityGroupId,
  sourceSecurityGroupId: ClusterSharedNodeSecurityGroup.id,
});

const InternetGateway = new aws.ec2.InternetGateway('InternetGateway', {
  tags: {
    Name: `${StackName}/InternetGateway`,
  },
});

const NATIP = new aws.ec2.Eip('NATIP', {
  vpc: true,
  tags: {
    Name: `${StackName}/NATIP`,
  },
});

const NATGateway = new aws.ec2.NatGateway('NATGateway', {
  allocationId: NATIP.id,
  subnetId: SubnetPublicAPSOUTHEAST1C.id,
  tags: {
    Name: `${StackName}/NATGateway`,
  },
});

const PrivateRouteTableAPSOUTHEAST1A = new aws.ec2.RouteTable('PrivateRouteTableAPSOUTHEAST1A', {
  vpcId: VPC.id,
  tags: {
    Name: `${StackName}/PrivateRouteTableAPSOUTHEAST1A`,
  },
});

const PrivateRouteTableAPSOUTHEAST1B = new aws.ec2.RouteTable('PrivateRouteTableAPSOUTHEAST1B', {
  vpcId: VPC.id,
  tags: {
    Name: `${StackName}/PrivateRouteTableAPSOUTHEAST1B`,
  },
});

const PrivateRouteTableAPSOUTHEAST1C = new aws.ec2.RouteTable('PrivateRouteTableAPSOUTHEAST1C', {
  vpcId: VPC.id,
  tags: {
    Name: `${StackName}/PrivateRouteTableAPSOUTHEAST1C`,
  },
});

const NATPrivateSubnetRouteAPSOUTHEAST1A = new aws.ec2.Route('NATPrivateSubnetRouteAPSOUTHEAST1A', {
  destinationCidrBlock: '0.0.0.0/0',
  natGatewayId: NATGateway.id,
  routeTableId: PrivateRouteTableAPSOUTHEAST1A.id,
});

const NATPrivateSubnetRouteAPSOUTHEAST1B = new aws.ec2.Route('NATPrivateSubnetRouteAPSOUTHEAST1B', {
  destinationCidrBlock: '0.0.0.0/0',
  natGatewayId: NATGateway.id,
  routeTableId: PrivateRouteTableAPSOUTHEAST1B.id,
});

const NATPrivateSubnetRouteAPSOUTHEAST1C = new aws.ec2.Route('NATPrivateSubnetRouteAPSOUTHEAST1C', {
  destinationCidrBlock: '0.0.0.0/0',
  natGatewayId: NATGateway.id,
  routeTableId: PrivateRouteTableAPSOUTHEAST1C.id,
});

const PublicRouteTable = new aws.ec2.RouteTable('PublicRouteTable', {
  vpcId: VPC.id,
  tags: {
    Name: `${StackName}/PublicRouteTable`,
  },
});

const PublicSubnetRoute = new aws.ec2.Route(
  'PublicSubnetRoute',
  {
    destinationCidrBlock: '0.0.0.0/0',
    gatewayId: InternetGateway.id,
    routeTableId: PublicRouteTable.id,
  },
);

const RouteTableAssociationPrivateAPSOUTHEAST1A = new aws.ec2.RouteTableAssociation(
  'RouteTableAssociationPrivateAPSOUTHEAST1A',
  {
    routeTableId: PrivateRouteTableAPSOUTHEAST1A.id,
    subnetId: SubnetPrivateAPSOUTHEAST1A.id,
  },
);

const RouteTableAssociationPrivateAPSOUTHEAST1B = new aws.ec2.RouteTableAssociation(
  'RouteTableAssociationPrivateAPSOUTHEAST1B',
  {
    routeTableId: PrivateRouteTableAPSOUTHEAST1B.id,
    subnetId: SubnetPrivateAPSOUTHEAST1B.id,
  },
);

const RouteTableAssociationPrivateAPSOUTHEAST1C = new aws.ec2.RouteTableAssociation(
  'RouteTableAssociationPrivateAPSOUTHEAST1C',
  {
    routeTableId: PrivateRouteTableAPSOUTHEAST1C.id,
    subnetId: SubnetPrivateAPSOUTHEAST1C.id,
  },
);

const RouteTableAssociationPublicAPSOUTHEAST1A = new aws.ec2.RouteTableAssociation(
  'RouteTableAssociationPublicAPSOUTHEAST1A',
  {
    routeTableId: PublicRouteTable.id,
    subnetId: SubnetPublicAPSOUTHEAST1A.id,
  },
);

const RouteTableAssociationPublicAPSOUTHEAST1B = new aws.ec2.RouteTableAssociation(
  'RouteTableAssociationPublicAPSOUTHEAST1B',
  {
    routeTableId: PublicRouteTable.id,
    subnetId: SubnetPublicAPSOUTHEAST1B.id,
  },
);

const RouteTableAssociationPublicAPSOUTHEAST1C = new aws.ec2.RouteTableAssociation(
  'RouteTableAssociationPublicAPSOUTHEAST1C',
  {
    routeTableId: PublicRouteTable.id,
    subnetId: SubnetPublicAPSOUTHEAST1C.id,
  },
);

const VPCGatewayAttachment = new aws.ec2.InternetGatewayAttachment(
  'VPCGatewayAttachment',
  {
    internetGatewayId: InternetGateway.id,
    vpcId: VPC.id,
  },
);

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthorities;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = StackName;
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'single';
export const SecurityGroup = ControlPlaneSecurityGroup;
export const ServiceRoleARN = ServiceRole.arn;
export const SharedNodeSecurityGroup = ClusterSharedNodeSecurityGroup;
export const SubnetsPrivate = [
  SubnetPrivateAPSOUTHEAST1C,
  SubnetPrivateAPSOUTHEAST1B,
  SubnetPrivateAPSOUTHEAST1A,
].join(',');
export const SubnetsPublic = [
  SubnetPublicAPSOUTHEAST1C,
  SubnetPublicAPSOUTHEAST1B,
  SubnetPublicAPSOUTHEAST1A,
].join(',');
export {
  VPC,
  IngressDefaultClusterToNodeSG,
  IngressInterNodeGroupSG,
  IngressNodeToDefaultClusterSG,
  NATPrivateSubnetRouteAPSOUTHEAST1A,
  NATPrivateSubnetRouteAPSOUTHEAST1B,
  NATPrivateSubnetRouteAPSOUTHEAST1C,
  PublicSubnetRoute,
  RouteTableAssociationPrivateAPSOUTHEAST1A,
  RouteTableAssociationPrivateAPSOUTHEAST1B,
  RouteTableAssociationPrivateAPSOUTHEAST1C,
  RouteTableAssociationPublicAPSOUTHEAST1A,
  RouteTableAssociationPublicAPSOUTHEAST1B,
  RouteTableAssociationPublicAPSOUTHEAST1C,
  VPCGatewayAttachment,
};
