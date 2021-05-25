import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Swap} from '../models';
import {SwapRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class SwapService {
  constructor(
    @repository(SwapRepository) private swapRepository: SwapRepository,
  ) { }

  async createRecord(newSwap: Swap) {
    return this.swapRepository.create(newSwap);
  }

  async findById(id: string) {
    return this.swapRepository.findById(id);
  }

  async findByHash(hash: string) {
    return this.swapRepository.findOne({
      where: {
        txid: hash
      }
    });
  }
}
