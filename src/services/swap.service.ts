import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Swap} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class SwapService {
  constructor(private swap: Swap) {}
}
