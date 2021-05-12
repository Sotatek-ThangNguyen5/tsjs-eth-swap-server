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
    if (!this.tokenContract.address) {
      throw new Error(
        `TokenService::Empty Token Contract address. Value: ${this.tokenContract.address}`,
      );
    }
    return this.tokenContract.address;
  }
  // Return the token ABI
  async getTokenAbi() {
    if (!this.tokenAbi) {
      throw new Error(`TokenService::Empty Token ABI. Value: ${this.tokenAbi}`);
    }
    return this.tokenAbi;
  }

  // Get token decimals
  async getTokenDecimals() {
    return this.tokenContract.decimals();
  }

  // Get token deposit address
  getDepositAddress() {
    const depositAddress = process.env.DEPOSIT_ACCOUNT_ADDRESS;
    if (!depositAddress) {
      throw new Error(
        `TokenService::Empty deposit address. Value: ${depositAddress}`,
      );
    }
    return depositAddress;
  }
  // Get interact wallet address
  getAccountAddress() {
    return this.connectionService.getAddress();
  }
  // Return the token contract
  getTokenContract() {
    return this.tokenContract;
  }
  // Return token balance of funding account
  getTokenBalanceOf(address: string) {
    return this.tokenContract.balanceOf(address);
  }

  // Transfer WXPX
  async transferWxpx(to: string, value: number) {
    const gasPrice = await this.connectionService.getGasPrice();
    const transferResponse = await this.tokenContract.transfer(to, value, {
      gasPrice,
    });
    return transferResponse;
  }
}
