import CF from './eks/08/cf';
import EC2 from './eks/08/ec2';
import EKS from './eks/08/eks';
import IAM from './eks/08/iam';

const cf = new CF();
const ec2 = new EC2();
const eks = new EKS();
const iam = new IAM();

const VPC = ec2.VPC();
cf.vpc = VPC;
ec2.InternetGateway();
ec2.VPCGatewayAttachment();
ec2.PrivateRouteTableAPSOUTHEAST1A();
ec2.PrivateRouteTableAPSOUTHEAST1B();
ec2.PrivateRouteTableAPSOUTHEAST1C();

ec2.cidr = cf.CIDR();
const ClusterSharedNodeSecurityGroup = ec2.ClusterSharedNodeSecurityGroup();
eks.controlPlaneSecurityGroup = ec2.ControlPlaneSecurityGroup();
const ControlPlaneSecurityGroup = eks.controlPlaneSecurityGroup;
const SubnetPrivateAPSOUTHEAST1A = ec2.SubnetPrivateAPSOUTHEAST1A();
const SubnetPrivateAPSOUTHEAST1B = ec2.SubnetPrivateAPSOUTHEAST1B();
const SubnetPrivateAPSOUTHEAST1C = ec2.SubnetPrivateAPSOUTHEAST1C();
const SubnetPublicAPSOUTHEAST1A = ec2.SubnetPublicAPSOUTHEAST1A();
const SubnetPublicAPSOUTHEAST1B = ec2.SubnetPublicAPSOUTHEAST1B();
const SubnetPublicAPSOUTHEAST1C = ec2.SubnetPublicAPSOUTHEAST1C();

ec2.NATIP();
ec2.NATGateway();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1A();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1B();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1C();
ec2.PublicRouteTable();
ec2.PublicSubnetRoute();
ec2.PublicSubnetIPv6DefaultRoute();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1A();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1B();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1C();
ec2.RouteTableAssociationPublicAPSOUTHEAST1A();
ec2.RouteTableAssociationPublicAPSOUTHEAST1B();
ec2.RouteTableAssociationPublicAPSOUTHEAST1C();

iam.PolicyCloudWatchMetrics();
iam.PolicyELBPermissions();
eks.serviceRole = iam.ServiceRole();
eks.subnetPrivateAPSOUTHEAST1A = SubnetPrivateAPSOUTHEAST1A;
eks.subnetPrivateAPSOUTHEAST1B = SubnetPrivateAPSOUTHEAST1B;
eks.subnetPrivateAPSOUTHEAST1C = SubnetPrivateAPSOUTHEAST1C;
eks.subnetPublicAPSOUTHEAST1A = SubnetPublicAPSOUTHEAST1A;
eks.subnetPublicAPSOUTHEAST1B = SubnetPublicAPSOUTHEAST1B;
eks.subnetPublicAPSOUTHEAST1C = SubnetPublicAPSOUTHEAST1C;

const ServiceRole = eks.serviceRole;
const ControlPlane = eks.ControlPlane();
ec2.controlPlane = ControlPlane;
eks.NodeAddon();
ec2.IngressDefaultClusterToNodeSG();
ec2.IngressInterNodeGroupSG();
ec2.IngressNodeToDefaultClusterSG();
iam.PolicyAutoScaling();
iam.PolicyEBS();
iam.PolicyEFS();
iam.PolicyEFSEC2();
iam.PolicyFSX();
iam.PolicyServiceLinkRole();

eks.nodeInstanceRole = iam.NodeInstanceRole();
const NodeInstanceRole = eks.nodeInstanceRole;
const NodeInstanceProfile = iam.NodeInstanceProfile();
eks.NodeGroupOnePublic();

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthority;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = ec2.StackName;
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'Disable';
export const SecurityGroup = ControlPlaneSecurityGroup.arn;
export const ServiceRoleARN = ServiceRole.arn;
export const SharedNodeSecurityGroup = ClusterSharedNodeSecurityGroup.arn;
export const Subnets = [
  SubnetPrivateAPSOUTHEAST1A.arn,
  SubnetPrivateAPSOUTHEAST1B.arn,
  SubnetPrivateAPSOUTHEAST1C.arn,
  SubnetPublicAPSOUTHEAST1A.arn,
  SubnetPublicAPSOUTHEAST1B.arn,
  SubnetPublicAPSOUTHEAST1C.arn,
];
export const VPCARN = VPC.arn;
export const FeatureLocalSecurityGroup = true;
export const FeaturePrivateNetworking = false;
export const FeatureSharedSecurityGroup = true;
export const InstanceProfileARN = NodeInstanceProfile.arn;
export const InstanceRoleARN = NodeInstanceRole.arn;
