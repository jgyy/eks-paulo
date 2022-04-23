import * as aws from '@pulumi/aws';

const StackName = 'cluster-1';

const AvailabilityZones = aws.getAvailabilityZones({
  state: 'available',
});

const AmazonEKSClusterPolicy = aws.iam.getPolicy({
  name: 'AmazonEKSClusterPolicy',
});

const AmazonEKSVPCResourceController = aws.iam.getPolicy({
  name: 'AmazonEKSVPCResourceController',
});

const AmazonEC2ContainerRegistryReadOnly = aws.iam.getPolicy({
  name: 'AmazonEC2ContainerRegistryReadOnly',
});

const AmazonEKSWorkerNodePolicy = aws.iam.getPolicy({
  name: 'AmazonEKSWorkerNodePolicy',
});

const AmazonEKSCNIPolicy = aws.iam.getPolicy({
  name: 'AmazonEKS_CNI_Policy',
});

const AmazonSSMManagedInstanceCore = aws.iam.getPolicy({
  name: 'AmazonSSMManagedInstanceCore',
});

export {
  StackName,
  AvailabilityZones,
  AmazonEKSClusterPolicy,
  AmazonEKSVPCResourceController,
  AmazonEC2ContainerRegistryReadOnly,
  AmazonEKSWorkerNodePolicy,
  AmazonEKSCNIPolicy,
  AmazonSSMManagedInstanceCore,
};
