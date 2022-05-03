import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as cp from 'child_process';
import * as fs from 'fs';
import Resources from './resource';

class Parameters extends Resources {
  CheckCreated = (...resource: any[]) => {
    const err = [];
    resource.forEach((r) => {
      if (!this[r]) {
        err.push(`${r} = ${this[r]}`);
      }
    });
    if (err.length !== 0) {
      throw new this.E(err.join('\n'));
    }
  };

  E = Error;

  getAMI = aws.ec2.getAmi;

  getAZ = aws.getAvailabilityZones;

  getPolicy = aws.iam.getPolicy;

  NodeGroupName = 'ng-1';

  StackName = 'cluster-1';

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

  AMIID = () => pulumi.output(this.getAMI({
    filters: [
      {
        name: 'name',
        values: ['amazon-eks-node-1.22-v20220421'],
      },
    ],
    mostRecent: true,
    owners: ['602401143452'],
  }));

  AvailabilityZones = () => pulumi.output(
    this.getAZ({
      state: 'available',
    }),
  ).apply((a) => a.names.sort());

  DefaultVPC = () => {
    this.vpc = pulumi.output(
      aws.ec2.getVpc({
        tags: { Name: 'Default/VPC' },
      }),
    );
    return this.vpc;
  };

  DefaultSubnetPublicAPSOUTHEAST1A = () => {
    this.subnetPublicAPSOUTHEAST1A = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPublicAPSOUTHEAST1A'],
        }],
      }),
    );
    return this.subnetPublicAPSOUTHEAST1A;
  };

  DefaultSubnetPublicAPSOUTHEAST1B = () => {
    this.subnetPublicAPSOUTHEAST1B = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPublicAPSOUTHEAST1B'],
        }],
      }),
    );
    return this.subnetPublicAPSOUTHEAST1B;
  };

  DefaultSubnetPublicAPSOUTHEAST1C = () => {
    this.subnetPublicAPSOUTHEAST1C = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPublicAPSOUTHEAST1C'],
        }],
      }),
    );
    return this.subnetPublicAPSOUTHEAST1C;
  };

  DefaultSubnetPrivateAPSOUTHEAST1A = () => {
    this.subnetPrivateAPSOUTHEAST1A = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPrivateAPSOUTHEAST1A'],
        }],
      }),
    );
    return this.subnetPrivateAPSOUTHEAST1A;
  };

  DefaultSubnetPrivateAPSOUTHEAST1B = () => {
    this.subnetPrivateAPSOUTHEAST1B = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPrivateAPSOUTHEAST1B'],
        }],
      }),
    );
    return this.subnetPrivateAPSOUTHEAST1B;
  };

  DefaultSubnetPrivateAPSOUTHEAST1C = () => {
    this.subnetPrivateAPSOUTHEAST1C = pulumi.output(
      aws.ec2.getSubnet({
        filters: [{
          name: 'tag:Name',
          values: ['Default/SubnetPrivateAPSOUTHEAST1C'],
        }],
      }),
    );
    return this.subnetPrivateAPSOUTHEAST1C;
  };

  UpdateKubeconfig = () => {
    this.CheckCreated('managedNodeGroup');
    this.managedNodeGroup.id.apply((i) => cp.exec(`
echo "${i}";
aws eks update-kubeconfig --region ap-southeast-1 --name ${this.StackName};
    `));
  };
}

export default Parameters;
