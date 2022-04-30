import EC2 from './eks/06/ec2';
import EKS from './eks/06/eks';
import IAM from './eks/06/iam';
import CF from './eks/06/cf';

const ec2 = new EC2();
const eks = new EKS();
const iam = new IAM();
const cf = new CF();

const VPC = ec2.VPC();
cf.VPC = VPC;

iam.PolicyAutoScaling();
iam.PolicyCloudWatchMetrics();
iam.PolicyEBS();
iam.PolicyEFS();
iam.PolicyEFSEC2();
iam.PolicyELBPermissions();
iam.PolicyFSX();
iam.PolicyServiceLinkRole();

const NodeInstanceRole = iam.NodeInstanceRole();
eks.NodeInstanceRole = NodeInstanceRole;
const ServiceRole = iam.ServiceRole();
eks.ServiceRole = ServiceRole;

iam.NodeInstanceProfile();
ec2.NATIP();
ec2.InternetGateway();
ec2.PrivateRouteTableAPSOUTHEAST1A();
ec2.PrivateRouteTableAPSOUTHEAST1B();
ec2.PrivateRouteTableAPSOUTHEAST1C();
ec2.PublicRouteTable();

const ClusterSharedNodeSecurityGroup = ec2.ClusterSharedNodeSecurityGroup();
const ControlPlaneSecurityGroup = ec2.ControlPlaneSecurityGroup();
eks.ControlPlaneSecurityGroup = ControlPlaneSecurityGroup;

const CIDR = cf.CIDR();
ec2.CIDR = CIDR;

ec2.VPCGatewayAttachment();
ec2.PublicSubnetRoute();
ec2.PublicSubnetIPv6DefaultRoute();

const SubnetPrivateAPSOUTHEAST1A = ec2.SubnetPrivateAPSOUTHEAST1A();
eks.SubnetPrivateAPSOUTHEAST1A = SubnetPrivateAPSOUTHEAST1A;
const SubnetPrivateAPSOUTHEAST1B = ec2.SubnetPrivateAPSOUTHEAST1B();
eks.SubnetPrivateAPSOUTHEAST1B = SubnetPrivateAPSOUTHEAST1B;
const SubnetPrivateAPSOUTHEAST1C = ec2.SubnetPrivateAPSOUTHEAST1C();
eks.SubnetPrivateAPSOUTHEAST1C = SubnetPrivateAPSOUTHEAST1C;
const SubnetPublicAPSOUTHEAST1A = ec2.SubnetPublicAPSOUTHEAST1A();
eks.SubnetPublicAPSOUTHEAST1A = SubnetPublicAPSOUTHEAST1A;
const SubnetPublicAPSOUTHEAST1B = ec2.SubnetPublicAPSOUTHEAST1B();
eks.SubnetPublicAPSOUTHEAST1B = SubnetPublicAPSOUTHEAST1B;
const SubnetPublicAPSOUTHEAST1C = ec2.SubnetPublicAPSOUTHEAST1C();
eks.SubnetPublicAPSOUTHEAST1C = SubnetPublicAPSOUTHEAST1C;

ec2.RouteTableAssociationPrivateAPSOUTHEAST1A();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1B();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1C();
ec2.RouteTableAssociationPublicAPSOUTHEAST1A();
ec2.RouteTableAssociationPublicAPSOUTHEAST1B();
ec2.RouteTableAssociationPublicAPSOUTHEAST1C();
ec2.NATGateway();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1A();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1B();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1C();

const ControlPlane = eks.ControlPlane();
ec2.ControlPlane = ControlPlane;

eks.NodeGroupOnePublic();
ec2.IngressDefaultClusterToNodeSG();
ec2.IngressInterNodeGroupSG();
ec2.IngressNodeToDefaultClusterSG();

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthority;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = 'cluster-5';
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'Single';
export const SecurityGroup = ControlPlaneSecurityGroup.arn;
export const ServiceRoleARN = ServiceRole.arn;
export const SharedNodeSecurityGroup = ClusterSharedNodeSecurityGroup.arn;
export const SubnetsPrivate = [
  SubnetPrivateAPSOUTHEAST1A.arn,
  SubnetPrivateAPSOUTHEAST1B.arn,
  SubnetPrivateAPSOUTHEAST1C.arn,
];
export const SubnetsPublic = [
  SubnetPublicAPSOUTHEAST1A.arn,
  SubnetPublicAPSOUTHEAST1B.arn,
  SubnetPublicAPSOUTHEAST1C.arn,
];
export const VPCARN = VPC.arn;
export const FeatureLocalSecurityGroup = true;
export const FeaturePrivateNetworking = true;
export const FeatureSharedSecurityGroup = true;
export const InstanceRoleARN = NodeInstanceRole.arn;