import {WebSocketProvider} from '@ethersproject/providers';
import {BindingScope, injectable, service} from '@loopback/core';
import {EventFilter, utils} from 'ethers';
import {ConnectionService} from './connection.service';
import {TokenService} from './token.service';

@injectable({scope: BindingScope.TRANSIENT})
export class Events {
  // Private websocket Provider
  private websocketProvider: WebSocketProvider;
  // Create static instance
  private static instance: Events;
  // Property that describe status of websocket
  // prevent double events on one chanel
  private isListening = false;
  // Constructor for event services
  constructor(
    @service() private connectionService: ConnectionService,
    @service() private tokenService: TokenService,
  ) {
    this.websocketProvider = connectionService.getWssProvider();
  }

  public static getInstance(): Events {
    if (!Events.instance) {
      // Get instance of
      const connectionService = new ConnectionService();
      const tokenService = new TokenService(connectionService);

      Events.instance = new Events(connectionService, tokenService);
    }

    return Events.instance;
  }

  async onNewSwapFromWxpx() {
    if (!this.isListening) {
      const tokenContract = this.tokenService.getTokenContract();
      const depositAddress = this.tokenService.getDepositAddress();
      const provider = this.connectionService.getProvider();

      const filter: EventFilter = {
        address: tokenContract.address,
        topics: [utils.id('Transfer(address,address,uint256)')],
      };

      tokenContract.on(filter, (from, to, value, transactionDetail) => {
        console.log({from, to, value, transactionDetail});
        // Implement a swap here

        // Check if to address == deposit address

        // Check value of a swap

        // Validate from

        // Create record for swap
      });

      console.log('RUN');
      this.isListening = true;
    } else {
      console.log('Not RUN');
    }
  }
}
