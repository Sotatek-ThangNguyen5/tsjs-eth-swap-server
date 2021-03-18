import {BindingScope, injectable} from '@loopback/core';
import {BytesLike, utils} from 'ethers';
@injectable({scope: BindingScope.SINGLETON})
export class VerifierService {
  constructor() {}

  verifyMessage(message: string, signature: BytesLike) {
    return utils.verifyMessage(message, signature);
  }
}
