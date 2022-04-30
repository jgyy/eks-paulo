import EC2 from './eks/04/ec2';
import EKS from './eks/04/eks';
import IAM from './eks/04/iam';

const ec2 = new EC2();
const eks = new EKS();
const iam = new IAM();

const VPC = ec2.DefaultVPC();
const ClusterSharedNodeSecurityGroup = ec2.ClusterSharedNodeSecurityGroup();
eks.controlPlaneSecurityGroup = ec2.ControlPlaneSecurityGroup();
const ControlPlaneSecurityGroup = eks.controlPlaneSecurityGroup;

const SubnetPrivateAPSOUTHEAST1A = eks.DefaultSubnetPrivateAPSOUTHEAST1A();
const SubnetPrivateAPSOUTHEAST1B = eks.DefaultSubnetPrivateAPSOUTHEAST1B();
const SubnetPrivateAPSOUTHEAST1C = eks.DefaultSubnetPrivateAPSOUTHEAST1C();
const SubnetPublicAPSOUTHEAST1A = eks.DefaultSubnetPublicAPSOUTHEAST1A();
const SubnetPublicAPSOUTHEAST1B = eks.DefaultSubnetPublicAPSOUTHEAST1B();
const SubnetPublicAPSOUTHEAST1C = eks.DefaultSubnetPublicAPSOUTHEAST1C();

iam.PolicyCloudWatchMetrics();
iam.PolicyELBPermissions();
eks.serviceRole = iam.ServiceRole();
const ServiceRole = eks.serviceRole;
const ControlPlane = eks.ControlPlane();
ec2.controlPlane = ControlPlane;
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
iam.NodeInstanceProfile();
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
