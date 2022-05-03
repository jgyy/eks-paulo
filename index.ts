import CF from './01/cf';
import EC2 from './01/ec2';
import EKS from './01/eks';
import IAM from './01/iam';

const cf = new CF();
const ec2 = new EC2();
const eks = new EKS();
const iam = new IAM();

const VPC = ec2.VPC();
cf.vpc = VPC;
const ClusterSharedNodeSecurityGroup = ec2.ClusterSharedNodeSecurityGroup();
const ControlPlaneSecurityGroup = ec2.ControlPlaneSecurityGroup();
eks.controlPlaneSecurityGroup = ControlPlaneSecurityGroup;

ec2.cidr = cf.CIDR();
const SubnetPrivateAPSOUTHEAST1A = ec2.SubnetPrivateAPSOUTHEAST1A();
const SubnetPrivateAPSOUTHEAST1B = ec2.SubnetPrivateAPSOUTHEAST1B();
const SubnetPrivateAPSOUTHEAST1C = ec2.SubnetPrivateAPSOUTHEAST1C();
const SubnetPublicAPSOUTHEAST1A = ec2.SubnetPublicAPSOUTHEAST1A();
const SubnetPublicAPSOUTHEAST1B = ec2.SubnetPublicAPSOUTHEAST1B();
const SubnetPublicAPSOUTHEAST1C = ec2.SubnetPublicAPSOUTHEAST1C();

iam.PolicyCloudWatchMetrics();
iam.PolicyELBPermissions();
const ServiceRole = iam.ServiceRole();
eks.serviceRole = ServiceRole;
eks.subnetPrivateAPSOUTHEAST1A = SubnetPrivateAPSOUTHEAST1A;
eks.subnetPrivateAPSOUTHEAST1B = SubnetPrivateAPSOUTHEAST1B;
eks.subnetPrivateAPSOUTHEAST1C = SubnetPrivateAPSOUTHEAST1C;
eks.subnetPublicAPSOUTHEAST1A = SubnetPublicAPSOUTHEAST1A;
eks.subnetPublicAPSOUTHEAST1B = SubnetPublicAPSOUTHEAST1B;
eks.subnetPublicAPSOUTHEAST1C = SubnetPublicAPSOUTHEAST1C;
const ControlPlane = eks.ControlPlane();

ec2.controlPlane = ControlPlane;
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
ec2.PublicRouteTable();

ec2.VPCGatewayAttachment();
ec2.PublicSubnetRoute();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1A();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1B();
ec2.RouteTableAssociationPrivateAPSOUTHEAST1C();
ec2.RouteTableAssociationPublicAPSOUTHEAST1A();
ec2.RouteTableAssociationPublicAPSOUTHEAST1B();
ec2.RouteTableAssociationPublicAPSOUTHEAST1C();

eks.launchTemplate = ec2.LaunchTemplate();
iam.PolicyAutoScaling();
iam.PolicyEBS();
iam.PolicyEFS();
iam.PolicyEFSEC2();
iam.PolicyFSX();
iam.PolicyServiceLinkRole();
eks.nodeInstanceRole = iam.NodeInstanceRole();
eks.ManagedNodeGroup();
eks.UpdateKubeconfig();

export const ARN = ControlPlane.arn;
export const CertificateAuthorityData = ControlPlane.certificateAuthority;
export const ClusterSecurityGroupId = ControlPlane.vpcConfig.clusterSecurityGroupId;
export const ClusterStackName = ec2.StackName;
export const Endpoint = ControlPlane.endpoint;
export const FeatureNATMode = 'Single';
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
