import {JsonRpcProvider, WebSocketProvider} from '@ethersproject/providers';
import {BindingScope, injectable} from '@loopback/core';
import {Contract, ContractInterface, ethers, Wallet} from 'ethers';

@injectable({scope: BindingScope.TRANSIENT})
export class ConnectionService {
  private network = process.env.NETWORK ?? 'homestead';
  private infuraProvider = process.env.INFURA_ENDPOINTS;
  private infuraWebSocketProvider = process.env.INFURA_WSS_ENDPOINTS ?? '';
  private fundingAccountPrivateKey = process.env.FUNDING_ACCOUNT_PK ?? '';

  private provider: JsonRpcProvider;
  private websocketProvider: WebSocketProvider;
  private wallet: Wallet;

  constructor() {
    // Assign https provider
    this.provider = new ethers.providers.JsonRpcProvider(
      this.infuraProvider,
      this.network,
    );
    // Assign websocket providers
    this.websocketProvider = new ethers.providers.WebSocketProvider(
      this.infuraWebSocketProvider,
      this.network,
    );
    // Assign wallet
    this.wallet = new ethers.Wallet(this.fundingAccountPrivateKey);
  }
  // Get provider that initialized from constructor
  getProvider = () => {
    return this.provider;
  };
  // Get private Websocket providers that initialized from constructor
  getWssProvider = () => {
    return this.websocketProvider;
  };
  // Get private Signer for signature
  // and recover from signature
  getSigner = () => {
    return this.provider.getSigner();
  };
  // Get private wallet
  // use for transfer ETH
  getWallet = () => {
    return this.wallet;
  };
  // Connect to contract
  // using contract's address and it's abi
  connectContract = (address: string, abi: ContractInterface) => {
    return new Contract(address, abi, this.provider);
  };
}
