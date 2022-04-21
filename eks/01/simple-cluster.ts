import * as eks from '@pulumi/eks';

const cluster = new eks.Cluster(
  'cluster-1',
  {
    providerCredentialOpts: {
      profileName: 'jgyy',
    },
    enabledClusterLogTypes: [
      'audit',
      'authenticator',
      'controllerManager',
    ],
  },
);

const nodeGroup = new eks.NodeGroup(
  'ng-1',
  {
    cluster: cluster.core,
    instanceType: 'm5.large',
    desiredCapacity: 1,
  },
);

export { cluster, nodeGroup };
