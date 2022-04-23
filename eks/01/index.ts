import * as EC2 from './eks/01/ec2';
import * as EKS from './eks/01/eks';
import * as IAM from './eks/01/iam';
import * as PARAM from './eks/01/param';

const { VPC } = EC2.Vpc(PARAM.StackName);

const {
  ClusterSharedNodeSecurityGroup,
  ControlPlaneSecurityGroup,
} = EC2.SecurityGroup(PARAM.StackName, VPC);

const {
  SubnetPrivateAPSOUTHEAST1A,
  SubnetPrivateAPSOUTHEAST1B,
  SubnetPrivateAPSOUTHEAST1C,
  SubnetPublicAPSOUTHEAST1A,
  SubnetPublicAPSOUTHEAST1B,
  SubnetPublicAPSOUTHEAST1C,
} = EC2.Subnet(PARAM.StackName, VPC, PARAM.AvailabilityZones);

const { PolicyCloudWatchMetrics, PolicyELBPermissions } = IAM.Policy(PARAM.StackName);

const { ServiceRole, NodeInstanceRole } = IAM.Role(
  PARAM.StackName,
  PARAM.AmazonEKSClusterPolicy,
  PARAM.AmazonEKSVPCResourceController,
  PARAM.AmazonEC2ContainerRegistryReadOnly,
  PARAM.AmazonEKSWorkerNodePolicy,
  PARAM.AmazonEKSCNIPolicy,
  PARAM.AmazonSSMManagedInstanceCore,
  PolicyCloudWatchMetrics,
  PolicyELBPermissions,
);

const { ControlPlane } = EKS.Cluster(
  PARAM.StackName,
  ControlPlaneSecurityGroup,
  SubnetPublicAPSOUTHEAST1C,
  SubnetPublicAPSOUTHEAST1B,
  SubnetPublicAPSOUTHEAST1A,
  SubnetPrivateAPSOUTHEAST1C,
  SubnetPrivateAPSOUTHEAST1B,
  SubnetPrivateAPSOUTHEAST1A,
  ServiceRole,
);

const { NodeGroup } = EKS.NodeGroup(
  ControlPlane,
  NodeInstanceRole,
  SubnetPrivateAPSOUTHEAST1A,
  SubnetPrivateAPSOUTHEAST1B,
  SubnetPrivateAPSOUTHEAST1C,
);

const {
  IngressDefaultClusterToNodeSG,
  IngressInterNodeGroupSG,
  IngressNodeToDefaultClusterSG,
} = EC2.SecurityGroupRule(ClusterSharedNodeSecurityGroup, ControlPlane);

const { InternetGateway } = EC2.InternetGateway(PARAM.StackName);

const { NATIP } = EC2.Eip(PARAM.StackName);

const { NATGateway } = EC2.NatGateway(PARAM.StackName, NATIP, SubnetPublicAPSOUTHEAST1C);

const {
  PrivateRouteTableAPSOUTHEAST1A,
  PrivateRouteTableAPSOUTHEAST1B,
  PrivateRouteTableAPSOUTHEAST1C,
  PublicRouteTable,
} = EC2.RouteTable(PARAM.StackName, VPC);

const { VPCGatewayAttachment } = EC2.InternetGatewayAttachment(InternetGateway, VPC);

const {
  NATPrivateSubnetRouteAPSOUTHEAST1A,
  NATPrivateSubnetRouteAPSOUTHEAST1B,
  NATPrivateSubnetRouteAPSOUTHEAST1C,
  PublicSubnetRoute,
} = EC2.Route(
  NATGateway,
  PrivateRouteTableAPSOUTHEAST1A,
  PrivateRouteTableAPSOUTHEAST1B,
  PrivateRouteTableAPSOUTHEAST1C,
  InternetGateway,
  PublicRouteTable,
  VPCGatewayAttachment,
);

const {
  RouteTableAssociationPrivateAPSOUTHEAST1A,
  RouteTableAssociationPrivateAPSOUTHEAST1B,
  RouteTableAssociationPrivateAPSOUTHEAST1C,
  RouteTableAssociationPublicAPSOUTHEAST1A,
  RouteTableAssociationPublicAPSOUTHEAST1B,
  RouteTableAssociationPublicAPSOUTHEAST1C,
} = EC2.RouteTableAssociation(
  PrivateRouteTableAPSOUTHEAST1A,
  PrivateRouteTableAPSOUTHEAST1B,
  PrivateRouteTableAPSOUTHEAST1C,
  PublicRouteTable,
  SubnetPrivateAPSOUTHEAST1A,
  SubnetPrivateAPSOUTHEAST1B,
  SubnetPrivateAPSOUTHEAST1C,
  SubnetPublicAPSOUTHEAST1A,
  SubnetPublicAPSOUTHEAST1B,
  SubnetPublicAPSOUTHEAST1C,
);

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthority;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = PARAM.StackName;
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'Single';
export const SecurityGroup = ControlPlaneSecurityGroup;
export const ServiceRoleARN = ServiceRole.arn;
export const SharedNodeSecurityGroup = ClusterSharedNodeSecurityGroup;
export const FeatureLocalSecurityGroup = true;
export const FeaturePrivateNetworking = false;
export const FeatureSharedSecurityGroup = true;
export const InstanceProfileARN = NodeGroup.arn;
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
