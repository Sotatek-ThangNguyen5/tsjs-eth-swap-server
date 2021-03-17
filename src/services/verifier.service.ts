import {BindingScope, injectable} from '@loopback/core';
import {Bytes, BytesLike, utils} from 'ethers';
@injectable({scope: BindingScope.SINGLETON})
export class VerifierService {
  constructor() {}

  verifyMessage(message: Bytes, signature: BytesLike) {
    return utils.verifyMessage(message, signature);
  }
}
