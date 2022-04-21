import * as eks from '@pulumi/eks';

const cluster = new eks.Cluster(
  'cluster-2',
  {
    providerCredentialOpts: {
      profileName: 'jgyy',
    },
    kubernetesServiceIpAddressRange: '10.0.0.0/16',
  },
);

export default 'cluster-2';
export { cluster };
