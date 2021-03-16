import {BindingScope, injectable} from '@loopback/core';
import {Bytes, utils} from 'ethers';
@injectable({scope: BindingScope.SINGLETON})
export class VerifierService {
  constructor(/* Add @inject to inject parameters */) {}

  verifyMessage(message: Bytes, signature: any) {
    return utils.verifyMessage(message, signature);
  }
}
