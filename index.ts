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

const ClusterSharedNodeSecurityGroup = new aws.ec2.SecurityGroup('ClusterSharedNodeSecurityGroup', {
  description: 'Communication between all nodes in the cluster',
  vpcId: VPC.id,
  tags: {
    Name: `${StackName}/ClusterSharedNodeSecurityGroup`,
  },
});

const ControlPlaneSecurityGroup = new aws.ec2.SecurityGroup('ControlPlaneSecurityGroup', {
  description: 'Communication between the control plane and worker nodegroups',
  vpcId: VPC.id,
  tags: {
    Name: `${StackName}/ControlPlaneSecurityGroup`,
  },
});

const IngressDefaultClusterToNodeSG = new aws.ec2.SecurityGroupRule('IngressDefaultClusterToNodeSG', {
  description: 'Allow managed and unmanaged nodes to communicate with each other (all ports)',
  type: 'ingress',
  fromPort: 0,
  toPort: 65535,
  protocol: '-1',
  securityGroupId: 'sg-123456',
});

const SubnetPublicAPSOUTHEAST1C = new aws.ec2.Subnet('SubnetPublicAPSOUTHEAST1C', {
  vpcId: VPC.id,
  availabilityZone: 'ap-southeast-1c',
  cidrBlock: '192.168.0.0/19',
  mapPublicIpOnLaunch: true,
  tags: {
    'kubernetes.io/role/elb': '1',
    Name: `${StackName}/SubnetPublicAPSOUTHEAST1C`,
  },
});

const SubnetPublicAPSOUTHEAST1B = new aws.ec2.Subnet('SubnetPublicAPSOUTHEAST1B', {
  vpcId: VPC.id,
  availabilityZone: 'ap-southeast-1b',
  cidrBlock: '192.168.32.0/19',
  mapPublicIpOnLaunch: true,
  tags: {
    'kubernetes.io/role/elb': '1',
    Name: `${StackName}/SubnetPublicAPSOUTHEAST1B`,
  },
});

const SubnetPublicAPSOUTHEAST1A = new aws.ec2.Subnet('SubnetPublicAPSOUTHEAST1A', {
  vpcId: VPC.id,
  availabilityZone: 'ap-southeast-1a',
  cidrBlock: '192.168.64.0/19',
  mapPublicIpOnLaunch: true,
  tags: {
    'kubernetes.io/role/elb': '1',
    Name: `${StackName}/SubnetPublicAPSOUTHEAST1A`,
  },
});

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

export default StackName;
export {
  ControlPlane,
  IngressDefaultClusterToNodeSG,
};
