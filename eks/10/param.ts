import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as cp from 'child_process';
import Resources from './resource';

class Parameters {
  E = Error;

  getAMI = aws.ec2.getAmi;

  getAZ = aws.getAvailabilityZones;

  getPolicy = aws.iam.getPolicy;

  NodeGroupOne = 'ng1-encrypt-using-default-kms-key';

  NodeGroupTwo = 'ng2-encrypt-using-customer-encrytion-key';

  NodeGroupThree = 'ng-3';

  NodeGroupFour = 'ng-4';

  NodeGroupFive = 'ng-5';

  NodeGroupSix = 'ng-6';

  NodeGroupSeven = 'ng-7';

  resource: Resources | null = null;

  StackName = 'cluster-10';

  AmazonEC2ContainerRegistryReadOnly = () => pulumi.output(
    this.getPolicy({
      name: 'AmazonEC2ContainerRegistryReadOnly',
    }),
  ).arn;

  AmazonEKSClusterPolicy = () => pulumi.output(
    this.getPolicy({
      name: 'AmazonEKSClusterPolicy',
    }),
  ).arn;

  AmazonEKSCNIPolicy = () => pulumi.output(
    this.getPolicy({
      name: 'AmazonEKS_CNI_Policy',
    }),
  ).arn;

  AmazonEKSWorkerNodePolicy = () => pulumi.output(
    this.getPolicy({
      name: 'AmazonEKSWorkerNodePolicy',
    }),
  ).arn;

  AmazonSSMManagedInstanceCore = () => pulumi.output(
    this.getPolicy({
      name: 'AmazonSSMManagedInstanceCore',
    }),
  ).arn;

  AmazonEKSVPCResourceController = () => pulumi.output(
    this.getPolicy({
      name: 'AmazonEKSVPCResourceController',
    }),
  ).arn;

  AMILinux = () => pulumi.output(this.getAMI({
    filters: [
      {
        name: 'name',
        values: ['amzn2-ami-kernel-5.10-hvm-2.0.20220426.0-x86_64-gp2'],
      },
    ],
    mostRecent: true,
    owners: ['137112412989'],
  })).id;

  AvailabilityZones = () => pulumi.output(
    this.getAZ({
      state: 'available',
    }),
  ).apply((a) => a.names.sort());

  CheckCreated = (...resource: any[]) => {
    const err = [];
    resource.forEach((r) => {
      if (!this.resource[r]) {
        err.push(`${r} = ${this.resource[r]}`);
      }
    });
    if (err.length !== 0) {
      throw new this.E(err.join('\n'));
    }
  };

  DefaultVPC = () => {
    this.resource.vpc = pulumi.output(
      aws.ec2.getVpc({
        tags: { Name: 'Default/VPC' },
      }),
    );
    return this.resource.vpc;
  };

  DefaultSubnetPublicAPSOUTHEAST1A = () => {
    this.resource.subnetPublicAPSOUTHEAST1A = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPublicAPSOUTHEAST1A'],
        }],
      }),
    );
    return this.resource.subnetPublicAPSOUTHEAST1A;
  };

  DefaultSubnetPublicAPSOUTHEAST1B = () => {
    this.resource.subnetPublicAPSOUTHEAST1B = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPublicAPSOUTHEAST1B'],
        }],
      }),
    );
    return this.resource.subnetPublicAPSOUTHEAST1B;
  };

  DefaultSubnetPublicAPSOUTHEAST1C = () => {
    this.resource.subnetPublicAPSOUTHEAST1C = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPublicAPSOUTHEAST1C'],
        }],
      }),
    );
    return this.resource.subnetPublicAPSOUTHEAST1C;
  };

  DefaultSubnetPrivateAPSOUTHEAST1A = () => {
    this.resource.subnetPrivateAPSOUTHEAST1A = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPrivateAPSOUTHEAST1A'],
        }],
      }),
    );
    return this.resource.subnetPrivateAPSOUTHEAST1A;
  };

  DefaultSubnetPrivateAPSOUTHEAST1B = () => {
    this.resource.subnetPrivateAPSOUTHEAST1B = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPrivateAPSOUTHEAST1B'],
        }],
      }),
    );
    return this.resource.subnetPrivateAPSOUTHEAST1B;
  };

  DefaultSubnetPrivateAPSOUTHEAST1C = () => {
    this.resource.subnetPrivateAPSOUTHEAST1C = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPrivateAPSOUTHEAST1C'],
        }],
      }),
    );
    return this.resource.subnetPrivateAPSOUTHEAST1C;
  };

  UpdateKubeconfig = () => {
    this.CheckCreated('managedNodeGroupOne');
    this.resource.managedNodeGroupOne.id.apply((i) => cp.exec(`
echo "${i}";
aws eks update-kubeconfig --region ap-southeast-1 --name ${this.StackName};
    `));
  };
}

export default Parameters;
