import * as aws from '@pulumi/aws';
import * as awsn from '@pulumi/aws-native';
import * as pulumi from '@pulumi/pulumi';

class Resources {
  clusterSharedNodeSecurityGroup: aws.ec2.SecurityGroup | null = null;

  controlPlane: aws.eks.Cluster | null = null;

  controlPlaneSecurityGroup: aws.ec2.SecurityGroup | null = null;

  devKey: aws.ec2.KeyPair | null = null;

  internetGateway: aws.ec2.InternetGateway | null = null;

  launchTemplateOne: aws.ec2.LaunchTemplate | null = null;

  launchTemplateTwo: aws.ec2.LaunchTemplate | null = null;

  launchTemplateThree: aws.ec2.LaunchTemplate | null = null;

  natGatewayAPSOUTHEAST1A: aws.ec2.NatGateway | null = null;

  natGatewayAPSOUTHEAST1B: aws.ec2.NatGateway | null = null;

  natGatewayAPSOUTHEAST1C: aws.ec2.NatGateway | null = null;

  natIPAPSOUTHEAST1A: aws.ec2.Eip | null = null;

  natIPAPSOUTHEAST1B: aws.ec2.Eip | null = null;

  natIPAPSOUTHEAST1C: aws.ec2.Eip | null = null;

  managedNodeGroupOne: aws.eks.NodeGroup | null = null;

  managedNodeGroupTwo: aws.eks.NodeGroup | null = null;

  managedNodeGroupThree: aws.eks.NodeGroup | null = null;

  nodeInstanceProfile: aws.iam.InstanceProfile | null = null;

  nodeInstanceRole: aws.iam.Role | null = null;

  policyAutoScaling: aws.iam.Policy | null = null;

  policyCloudWatchMetrics: aws.iam.Policy | null = null;

  policyEBS: aws.iam.Policy | null = null;

  policyEFS: aws.iam.Policy | null = null;

  policyEFSEC2: aws.iam.Policy | null = null;

  policyELBPermissions: aws.iam.Policy | null = null;

  policyFSX: aws.iam.Policy | null = null;

  policyServiceLinkRole: aws.iam.Policy | null = null;

  serviceRole: aws.iam.Role | null = null;

  privateRouteTableAPSOUTHEAST1A: aws.ec2.RouteTable | null = null;

  privateRouteTableAPSOUTHEAST1B: aws.ec2.RouteTable | null = null;

  privateRouteTableAPSOUTHEAST1C: aws.ec2.RouteTable | null = null;

  publicRouteTable: aws.ec2.RouteTable | null = null;

  sg: aws.ec2.SecurityGroup | null = null;

  subnetPrivateAPSOUTHEAST1A: awsn.ec2.Subnet
    | pulumi.Output<aws.ec2.GetSubnetResult> | null = null;

  subnetPrivateAPSOUTHEAST1B: awsn.ec2.Subnet
  | pulumi.Output<aws.ec2.GetSubnetResult> | null = null;

  subnetPrivateAPSOUTHEAST1C: awsn.ec2.Subnet
  | pulumi.Output<aws.ec2.GetSubnetResult> | null = null;

  subnetPublicAPSOUTHEAST1A: awsn.ec2.Subnet
  | pulumi.Output<aws.ec2.GetSubnetResult> | null = null;

  subnetPublicAPSOUTHEAST1B: awsn.ec2.Subnet
  | pulumi.Output<aws.ec2.GetSubnetResult> | null = null;

  subnetPublicAPSOUTHEAST1C: awsn.ec2.Subnet
  | pulumi.Output<aws.ec2.GetSubnetResult> | null = null;

  vpc: awsn.ec2.VPC | pulumi.Output<aws.ec2.GetVpcResult> | null = null;

  vpcGatewayAttachment: aws.ec2.InternetGatewayAttachment | null = null;
}

export default Resources;
