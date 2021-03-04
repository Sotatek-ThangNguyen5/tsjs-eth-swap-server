import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Contract} from 'ethers';
import {Interface} from 'ethers/lib/utils';
import {ConnectionService} from './connection.service';

@injectable({scope: BindingScope.TRANSIENT})
export class TokenService {
  private tokenAddress: string = process.env.WXPX_ADDRESS ?? '';
  private tokenAbi: Interface;
  private tokenContract: Contract;

  constructor(@service() private connectionService: ConnectionService) {
    this.tokenContract = connectionService.connectContract(
      this.tokenAddress,
      this.tokenAbi,
    );
  }

  // Return the token address
  async getTokenAddress() {
    return this.tokenContract.address;
  }
  // Return the token ABI
  async getTokenAbi() {
    return this.tokenAbi;
  }
  // Return the token contract
  getTokenContract() {
    return this.tokenContract;
  }
}
