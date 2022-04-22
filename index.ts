import * as aws from '@pulumi/aws';

const StackName: string = 'cluster-1';

const VPC = new aws.ec2.Vpc(
  'VPC',
  {
    cidrBlock: '192.168.0.0/16',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
      Name: `${StackName}/VPC`,
    },
  },
);

const ClusterSharedNodeSecurityGroup = new aws.ec2.SecurityGroup(
  'ClusterSharedNodeSecurityGroup',
  {
    description: 'Communication between all nodes in the cluster',
    tags: {
      Name: `${StackName}/ClusterSharedNodeSecurityGroup`,
    },
    vpcId: VPC.id,
  },
);

const ControlPlaneSecurityGroup = new aws.ec2.SecurityGroup(
  'ControlPlaneSecurityGroup',
  {
    description: 'Communication between the control plane and worker nodegroups',
    tags: {
      Name: `${StackName}/ControlPlaneSecurityGroup`,
    },
    vpcId: VPC.id,
  },
);

const AvailabilityZones = aws.getAvailabilityZones({
  state: 'available',
});

const SubnetPrivateAPSOUTHEAST1A = new aws.ec2.Subnet(
  'SubnetPrivateAPSOUTHEAST1A',
  {
    availabilityZone: AvailabilityZones.then((az) => az.names[0]),
    cidrBlock: '192.168.128.0/19',
    tags: {
      'kubernetes.io/role/internal-elb': '1',
      'kubernetes.io/cluster/cluster-1': 'owned',
      Name: `${StackName}/SubnetPrivateAPSOUTHEAST1A`,
    },
    vpcId: VPC.id,
  },
);

const SubnetPrivateAPSOUTHEAST1B = new aws.ec2.Subnet(
  'SubnetPrivateAPSOUTHEAST1B',
  {
    availabilityZone: AvailabilityZones.then((az) => az.names[1]),
    cidrBlock: '192.168.160.0/19',
    tags: {
      'kubernetes.io/role/internal-elb': '1',
      'kubernetes.io/cluster/cluster-1': 'owned',
      Name: `${StackName}/SubnetPrivateAPSOUTHEAST1B`,
    },
    vpcId: VPC.id,
  },
);

const SubnetPrivateAPSOUTHEAST1C = new aws.ec2.Subnet(
  'SubnetPrivateAPSOUTHEAST1C',
  {
    availabilityZone: AvailabilityZones.then((az) => az.names[2]),
    cidrBlock: '192.168.96.0/19',
    tags: {
      'kubernetes.io/role/internal-elb': '1',
      'kubernetes.io/cluster/cluster-1': 'owned',
      Name: `${StackName}/SubnetPrivateAPSOUTHEAST1C`,
    },
    vpcId: VPC.id,
  },
);

const SubnetPublicAPSOUTHEAST1A = new aws.ec2.Subnet(
  'SubnetPublicAPSOUTHEAST1A',
  {
    availabilityZone: AvailabilityZones.then((az) => az.names[0]),
    cidrBlock: '192.168.32.0/19',
    tags: {
      'kubernetes.io/role/internal-elb': '1',
      'kubernetes.io/cluster/cluster-1': 'owned',
      Name: `${StackName}/SubnetPublicAPSOUTHEAST1A`,
    },
    vpcId: VPC.id,
  },
);

const SubnetPublicAPSOUTHEAST1B = new aws.ec2.Subnet(
  'SubnetPublicAPSOUTHEAST1B',
  {
    availabilityZone: AvailabilityZones.then((az) => az.names[1]),
    cidrBlock: '192.168.64.0/19',
    tags: {
      'kubernetes.io/role/internal-elb': '1',
      'kubernetes.io/cluster/cluster-1': 'owned',
      Name: `${StackName}/SubnetPublicAPSOUTHEAST1B`,
    },
    vpcId: VPC.id,
  },
);

const SubnetPublicAPSOUTHEAST1C = new aws.ec2.Subnet(
  'SubnetPublicAPSOUTHEAST1C',
  {
    availabilityZone: AvailabilityZones.then((az) => az.names[2]),
    cidrBlock: '192.168.0.0/19',
    tags: {
      'kubernetes.io/role/internal-elb': '1',
      'kubernetes.io/cluster/cluster-1': 'owned',
      Name: `${StackName}/SubnetPublicAPSOUTHEAST1C`,
    },
    vpcId: VPC.id,
  },
);

const PolicyCloudWatchMetrics = new aws.iam.Policy(
  'PolicyCloudWatchMetrics',
  {
    policy: JSON.stringify({
      Statement: [{
        Action: [
          'cloudwatch:PutMetricData',
        ],
        Effect: 'Allow',
        Resource: '*',
      }],
      Version: '2012-10-17',
    }),
    name: `${StackName}-PolicyCloudWatchMetrics`,
  },
);

const PolicyELBPermissions = new aws.iam.Policy(
  'PolicyELBPermissions',
  {
    policy: JSON.stringify({
      Statement: [{
        Action: [
          'ec2:DescribeAccountAttributes',
          'ec2:DescribeAddresses',
          'ec2:DescribeInternetGateways',
        ],
        Effect: 'Allow',
        Resource: '*',
      }],
      Version: '2012-10-17',
    }),
    name: `${StackName}-PolicyELBPermissions`,
  },
);

const AmazonEKSClusterPolicy = aws.iam.getPolicy({
  name: 'AmazonEKSClusterPolicy',
});

const AmazonEKSVPCResourceController = aws.iam.getPolicy({
  name: 'AmazonEKSVPCResourceController',
});

const ServiceRole = new aws.iam.Role(
  'ServiceRole',
  {
    assumeRolePolicy: JSON.stringify({
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: 'eks.amazonaws.com',
        },
      }],
      Version: '2012-10-17',
    }),
    managedPolicyArns: [
      AmazonEKSClusterPolicy.then((p) => p.arn),
      AmazonEKSVPCResourceController.then((p) => p.arn),
      PolicyCloudWatchMetrics.arn,
      PolicyELBPermissions.arn,
    ],
    tags: {
      Name: `${StackName}/ServiceRole`,
    },
  },
);

const ControlPlane = new aws.eks.Cluster(
  'ControlPlane',
  {
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
        SubnetPublicAPSOUTHEAST1A.id,
        SubnetPublicAPSOUTHEAST1B.id,
        SubnetPrivateAPSOUTHEAST1C.id,
        SubnetPrivateAPSOUTHEAST1A.id,
        SubnetPrivateAPSOUTHEAST1B.id,
      ],
    },
    roleArn: ServiceRole.arn,
    tags: {
      Name: `${StackName}/ControlPlane`,
    },
    version: '1.22',
  },
);

const IngressDefaultClusterToNodeSG = new aws.ec2.SecurityGroupRule(
  'IngressDefaultClusterToNodeSG',
  {
    type: 'ingress',
    description: 'Allow managed and unmanaged nodes to communicate with each other (all'
      + ' ports)',
    fromPort: 0,
    securityGroupId: ClusterSharedNodeSecurityGroup.id,
    protocol: '-1',
    sourceSecurityGroupId: ControlPlane.vpcConfig.clusterSecurityGroupId,
    toPort: 65535,
  },
);

const IngressInterNodeGroupSG = new aws.ec2.SecurityGroupRule(
  'IngressInterNodeGroupSG',
  {
    type: 'ingress',
    description: 'Allow nodes to communicate with each other (all ports)',
    fromPort: 0,
    securityGroupId: ClusterSharedNodeSecurityGroup.id,
    protocol: '-1',
    sourceSecurityGroupId: ClusterSharedNodeSecurityGroup.id,
    toPort: 65535,
  },
);

const IngressNodeToDefaultClusterSG = new aws.ec2.SecurityGroupRule(
  'IngressNodeToDefaultClusterSG',
  {
    type: 'ingress',
    description: 'Allow unmanaged nodes to communicate with control plane (all ports)',
    fromPort: 0,
    securityGroupId: ControlPlane.vpcConfig.clusterSecurityGroupId,
    protocol: '-1',
    sourceSecurityGroupId: ClusterSharedNodeSecurityGroup.id,
    toPort: 65535,
  },
);

const InternetGateway = new aws.ec2.InternetGateway(
  'InternetGateway',
  {
    tags: {
      Name: `${StackName}/InternetGateway`,
    },
  },
);

const NATIP = new aws.ec2.Eip(
  'NATIP',
  {
    vpc: true,
    tags: {
      Name: `${StackName}/NATIP`,
    },
  },
);

const NATGateway = new aws.ec2.NatGateway(
  'NATGateway',
  {
    allocationId: NATIP.id,
    subnetId: SubnetPublicAPSOUTHEAST1C.id,
    tags: {
      Name: `${StackName}/NATGateway`,
    },
  },
);

const PrivateRouteTableAPSOUTHEAST1A = new aws.ec2.RouteTable(
  'PrivateRouteTableAPSOUTHEAST1A',
  {
    tags: {
      Name: `${StackName}/PrivateRouteTableAPSOUTHEAST1A`,
    },
    vpcId: VPC.id,
  },
);

const PrivateRouteTableAPSOUTHEAST1B = new aws.ec2.RouteTable(
  'PrivateRouteTableAPSOUTHEAST1B',
  {
    tags: {
      Name: `${StackName}/PrivateRouteTableAPSOUTHEAST1B`,
    },
    vpcId: VPC.id,
  },
);

const PrivateRouteTableAPSOUTHEAST1C = new aws.ec2.RouteTable(
  'PrivateRouteTableAPSOUTHEAST1C',
  {
    tags: {
      Name: `${StackName}/PrivateRouteTableAPSOUTHEAST1C`,
    },
    vpcId: VPC.id,
  },
);

const NATPrivateSubnetRouteAPSOUTHEAST1A = new aws.ec2.Route(
  'NATPrivateSubnetRouteAPSOUTHEAST1A',
  {
    destinationCidrBlock: '0.0.0.0/0',
    natGatewayId: NATGateway.id,
    routeTableId: PrivateRouteTableAPSOUTHEAST1A.id,
  },
);

const NATPrivateSubnetRouteAPSOUTHEAST1B = new aws.ec2.Route(
  'NATPrivateSubnetRouteAPSOUTHEAST1B',
  {
    destinationCidrBlock: '0.0.0.0/0',
    natGatewayId: NATGateway.id,
    routeTableId: PrivateRouteTableAPSOUTHEAST1B.id,
  },
);

const NATPrivateSubnetRouteAPSOUTHEAST1C = new aws.ec2.Route(
  'NATPrivateSubnetRouteAPSOUTHEAST1C',
  {
    destinationCidrBlock: '0.0.0.0/0',
    natGatewayId: NATGateway.id,
    routeTableId: PrivateRouteTableAPSOUTHEAST1C.id,
  },
);

const PublicRouteTable = new aws.ec2.RouteTable(
  'PublicRouteTable',
  {
    tags: {
      Name: `${StackName}/PublicRouteTable`,
    },
    vpcId: VPC.id,
  },
);

const VPCGatewayAttachment = new aws.ec2.InternetGatewayAttachment(
  'VPCGatewayAttachment',
  {
    internetGatewayId: InternetGateway.id,
    vpcId: VPC.id,
  },
);

const PublicSubnetRoute = new aws.ec2.Route(
  'PublicSubnetRoute',
  {
    destinationCidrBlock: '0.0.0.0/0',
    gatewayId: InternetGateway.id,
    routeTableId: PublicRouteTable.id,
  },
  {
    dependsOn: [
      VPCGatewayAttachment,
    ],
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

const AmazonEC2ContainerRegistryReadOnly = aws.iam.getPolicy({
  name: 'AmazonEC2ContainerRegistryReadOnly',
});

const AmazonEKSWorkerNodePolicy = aws.iam.getPolicy({
  name: 'AmazonEKSWorkerNodePolicy',
});

const AmazonEKSCNIPolicy = aws.iam.getPolicy({
  name: 'AmazonEKS_CNI_Policy',
});

const AmazonSSMManagedInstanceCore = aws.iam.getPolicy({
  name: 'AmazonSSMManagedInstanceCore',
});

const NodeInstanceRole = new aws.iam.Role(
  'NodeInstanceRole',
  {
    assumeRolePolicy: JSON.stringify({
      Statement: [{
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: 'ec2.amazonaws.com',
        },
      }],
      Version: '2012-10-17',
    }),
    managedPolicyArns: [
      AmazonEC2ContainerRegistryReadOnly.then((p) => p.arn),
      AmazonEKSWorkerNodePolicy.then((p) => p.arn),
      AmazonEKSCNIPolicy.then((p) => p.arn),
      AmazonSSMManagedInstanceCore.then((p) => p.arn),
    ],
    path: '/',
    tags: {
      Name: `${StackName}/NodeInstanceRole`,
    },
  },
);

const NgOne = new aws.eks.NodeGroup(
  'ng-1',
  {
    nodeGroupName: 'ng-1',
    instanceTypes: ['m5.large'],
    clusterName: ControlPlane.name,
    nodeRoleArn: NodeInstanceRole.arn,
    subnetIds: [
      SubnetPrivateAPSOUTHEAST1A.id,
      SubnetPrivateAPSOUTHEAST1B.id,
      SubnetPrivateAPSOUTHEAST1C.id,
    ],
    scalingConfig: {
      desiredSize: 1,
      maxSize: 1,
      minSize: 1,
    },
    updateConfig: {
      maxUnavailable: 1,
    },
  },
);

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthority;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = StackName;
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'Single';
export const SecurityGroup = ControlPlaneSecurityGroup;
export const ServiceRoleARN = ServiceRole.arn;
export const SharedNodeSecurityGroup = ClusterSharedNodeSecurityGroup;
export const FeatureLocalSecurityGroup = true;
export const FeaturePrivateNetworking = false;
export const FeatureSharedSecurityGroup = true;
export const InstanceProfileARN = NgOne.arn;
export const SubnetsPrivate = [
  SubnetPrivateAPSOUTHEAST1C,
  SubnetPrivateAPSOUTHEAST1B,
  SubnetPrivateAPSOUTHEAST1A,
];
export const SubnetsPublic = [
  SubnetPublicAPSOUTHEAST1C,
  SubnetPublicAPSOUTHEAST1B,
  SubnetPublicAPSOUTHEAST1A,
];
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
};
