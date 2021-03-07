import {BindingScope, injectable, service} from '@loopback/core';
import {Contract, ContractInterface} from 'ethers';
import tokenArtifact from '../datasources/WXPX.json';
import {ConnectionService} from './connection.service';

@injectable({scope: BindingScope.TRANSIENT})
export class TokenService {
  private tokenAddress: string = process.env.WXPX_ADDRESS ?? '';
  private tokenAbi: ContractInterface = tokenArtifact.abi;
  private tokenContract: Contract;

  constructor(@service() private connectionService: ConnectionService) {
    this.tokenContract = connectionService.connectContract(
      this.tokenAddress,
      tokenArtifact.abi,
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

  // Get token decimals
  async getTokenDecimals() {
    return this.tokenContract.decimals();
  }

  // Get token deposit address
  getDepositAddress() {
    return process.env.DEPOSIT_ACCOUNT_ADDRESS ?? '';
  }

  // Return the token contract
  getTokenContract() {
    return this.tokenContract;
  }
}
