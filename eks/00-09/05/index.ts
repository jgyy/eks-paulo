import EC2 from './eks/05/ec2';
import EKS from './eks/05/eks';
import IAM from './eks/05/iam';
import Resources from './eks/05/resource';

const res = new Resources();
const ec2 = new EC2(res);
const eks = new EKS(res);
const iam = new IAM(res);

const VPC = ec2.VPC();
const SubnetPrivateAPSOUTHEAST1A = ec2.SubnetPrivateAPSOUTHEAST1A();
const SubnetPrivateAPSOUTHEAST1B = ec2.SubnetPrivateAPSOUTHEAST1B();
const SubnetPrivateAPSOUTHEAST1C = ec2.SubnetPrivateAPSOUTHEAST1C();
const SubnetPublicAPSOUTHEAST1A = ec2.SubnetPublicAPSOUTHEAST1A();
const SubnetPublicAPSOUTHEAST1B = ec2.SubnetPublicAPSOUTHEAST1B();
const SubnetPublicAPSOUTHEAST1C = ec2.SubnetPublicAPSOUTHEAST1C();

iam.PolicyCloudWatchMetrics();
iam.PolicyELBPermissions();
const ClusterSharedNodeSecurityGroup = ec2.ClusterSharedNodeSecurityGroup();
const ControlPlaneSecurityGroup = ec2.ControlPlaneSecurityGroup();
const ServiceRole = iam.ServiceRole();
const ControlPlane = eks.ControlPlane();
ec2.IngressDefaultClusterToNodeSG();
ec2.IngressInterNodeGroupSG();
ec2.IngressNodeToDefaultClusterSG();
ec2.InternetGateway();

ec2.NATIPAPSOUTHEAST1A();
ec2.NATIPAPSOUTHEAST1B();
ec2.NATIPAPSOUTHEAST1C();
ec2.NATGatewayAPSOUTHEAST1A();
ec2.NATGatewayAPSOUTHEAST1B();
ec2.NATGatewayAPSOUTHEAST1C();
ec2.PrivateRouteTableAPSOUTHEAST1A();
ec2.PrivateRouteTableAPSOUTHEAST1B();
ec2.PrivateRouteTableAPSOUTHEAST1C();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1A();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1B();
ec2.NATPrivateSubnetRouteAPSOUTHEAST1C();
ec2.VPCGatewayAttachment();
ec2.PublicRouteTable();
ec2.PublicSubnetRoute();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1A();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1B();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1C();
ec2.RouteTableAssociationPublicAPSOUTHEAST1A();
ec2.RouteTableAssociationPublicAPSOUTHEAST1B();
ec2.RouteTableAssociationPublicAPSOUTHEAST1C();

iam.PolicyAutoScaling();
iam.PolicyEBS();
iam.PolicyEFS();
iam.PolicyEFSEC2();
iam.PolicyFSX();
iam.PolicyServiceLinkRole();
iam.NodeInstanceRole();
ec2.LaunchTemplateOne();
ec2.LaunchTemplateTwo();
ec2.LaunchTemplateThree();
eks.ManagedNodeGroupOne();
eks.ManagedNodeGroupTwo();
eks.ManagedNodeGroupThree();

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthority;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = ec2.StackName;
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'Single';
export const SecurityGroup = ControlPlaneSecurityGroup.arn;
export const ServiceRoleARN = ServiceRole.arn;
export const SharedNodeSecurityGroup = ClusterSharedNodeSecurityGroup.arn;
export const SubnetsPrivate = [
  SubnetPrivateAPSOUTHEAST1A.id,
  SubnetPrivateAPSOUTHEAST1B.id,
  SubnetPrivateAPSOUTHEAST1C.id,
];
export const SubnetPublic = [
  SubnetPublicAPSOUTHEAST1A.id,
  SubnetPublicAPSOUTHEAST1B.id,
  SubnetPublicAPSOUTHEAST1C.id,
];
export const VPCARN = VPC.id;
