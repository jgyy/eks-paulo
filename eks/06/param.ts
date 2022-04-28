import * as aws from '@pulumi/aws';

class Parameters {
  AmazonEC2ContainerRegistryReadOnly = aws.iam.getPolicy({
    name: 'AmazonEC2ContainerRegistryReadOnly',
  }).then((p) => p.arn);

  AmazonEKSClusterPolicy = aws.iam.getPolicy({
    name: 'AmazonEKSClusterPolicy',
  }).then((p) => p.arn);

  AmazonEKSCNIPolicy = aws.iam.getPolicy({
    name: 'AmazonEKS_CNI_Policy',
  }).then((p) => p.arn);

  AmazonEKSWorkerNodePolicy = aws.iam.getPolicy({
    name: 'AmazonEKSWorkerNodePolicy',
  }).then((p) => p.arn);

  AmazonSSMManagedInstanceCore = aws.iam.getPolicy({
    name: 'AmazonSSMManagedInstanceCore',
  }).then((p) => p.arn);

  AmazonEKSVPCResourceController = aws.iam.getPolicy({
    name: 'AmazonEKSVPCResourceController',
  }).then((p) => p.arn);

  AvailabilityZones = aws.getAvailabilityZones({
    state: 'available',
  }).then((a) => a.names);

  StackName = 'cluster-5';
}

export default Parameters;
