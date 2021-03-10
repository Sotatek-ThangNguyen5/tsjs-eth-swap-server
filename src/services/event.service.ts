/* eslint-disable @typescript-eslint/no-floating-promises */
import {BindingScope, injectable, service} from '@loopback/core';
import {EventFilter, utils} from 'ethers';
import {Swap, Type} from '../models';
import {ConnectionService} from './connection.service';
import {SwapService} from './swap.service';
import {TokenService} from './token.service';

@injectable({scope: BindingScope.TRANSIENT})
export class Events {
  @service() private swapService: SwapService;
  // Create static instance
  private static instance: Events;
  // Property that describe status of websocket
  // prevent double events on one chanel
  private isListening = false;
  // Constructor for event services
  constructor(@service() private tokenService: TokenService) {}

  public static getInstance(): Events {
    if (!Events.instance) {
      // Get instance of
      const connectionService = new ConnectionService();
      const tokenService = new TokenService(connectionService);

      Events.instance = new Events(tokenService);
    }

    return Events.instance;
  }

  async newSwap() {
    if (!this.isListening) {
      const tokenContract = this.tokenService.getTokenContract();
      const depositAddress = this.tokenService.getDepositAddress();

      const filter: EventFilter = {
        address: tokenContract.address,
        topics: [utils.id('Transfer(address,address,uint256)')],
      };

      tokenContract.on(filter, (from, to, value, transactionDetail) => {
        if (to !== depositAddress) {
          // Implement logger here
        } else {
          const newSwapRecord = new Swap({
            txid: transactionDetail.transactionHash,
            blockNumber: transactionDetail.blockNumber,
            from,
            to,
            value,
            type: Type.WXPX,
          });

          this.swapService.createRecord(newSwapRecord);
        }
      });
      this.isListening = true;
    } else {
      console.log("Duplicate event won't run");
      return;
    }
  }
}
