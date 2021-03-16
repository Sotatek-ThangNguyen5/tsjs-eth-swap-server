import {/* inject, */ BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.SINGLETON})
export class VerifierService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
}
