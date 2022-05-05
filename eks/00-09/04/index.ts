import EC2 from './eks/04/ec2';
import EKS from './eks/04/eks';
import IAM from './eks/04/iam';
import Resources from './eks/04/resource';

const res = new Resources();
const ec2 = new EC2(res);
const eks = new EKS(res);
const iam = new IAM(res);

const VPC = ec2.DefaultVPC();
const SubnetPrivateAPSOUTHEAST1A = ec2.DefaultSubnetPrivateAPSOUTHEAST1A();
const SubnetPrivateAPSOUTHEAST1B = ec2.DefaultSubnetPrivateAPSOUTHEAST1B();
const SubnetPrivateAPSOUTHEAST1C = ec2.DefaultSubnetPrivateAPSOUTHEAST1C();
const SubnetPublicAPSOUTHEAST1A = ec2.DefaultSubnetPublicAPSOUTHEAST1A();
const SubnetPublicAPSOUTHEAST1B = ec2.DefaultSubnetPublicAPSOUTHEAST1B();
const SubnetPublicAPSOUTHEAST1C = ec2.DefaultSubnetPublicAPSOUTHEAST1C();

iam.PolicyCloudWatchMetrics();
iam.PolicyELBPermissions();
const ClusterSharedNodeSecurityGroup = ec2.ClusterSharedNodeSecurityGroup();
const ControlPlaneSecurityGroup = ec2.ControlPlaneSecurityGroup();
const ServiceRole = iam.ServiceRole();
const ControlPlane = eks.ControlPlane();
ec2.IngressDefaultClusterToNodeSG();
ec2.IngressInterNodeGroupSG();
ec2.IngressNodeToDefaultClusterSG();

iam.PolicyAutoScaling();
iam.PolicyEBS();
iam.PolicyEFS();
iam.PolicyEFSEC2();
iam.PolicyFSX();
iam.PolicyServiceLinkRole();
iam.NodeInstanceRole();
ec2.LaunchTemplateOne();
eks.ManagedNodeGroupOne();

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
  SubnetPrivateAPSOUTHEAST1A.arn,
  SubnetPrivateAPSOUTHEAST1B.arn,
  SubnetPrivateAPSOUTHEAST1C.arn,
];
export const SubnetPublic = [
  SubnetPublicAPSOUTHEAST1A.arn,
  SubnetPublicAPSOUTHEAST1B.arn,
  SubnetPublicAPSOUTHEAST1C.arn,
];
export const VPCARN = VPC.arn;
