import * as aws from '@pulumi/aws';
import Parameters from './param';
import Resources from './resource';

class KMS extends Parameters {
  constructor(resource: Resources) {
    super();
    this.resource = resource;
  }

  KmsKey = () => {
    this.resource.kmsKey = new aws.kms.Key(
      'KmsKey',
      {
        deletionWindowInDays: 7,
        description: 'KMS key 1',
      },
    );
    return this.resource.kmsKey;
  };
}

export default KMS;
