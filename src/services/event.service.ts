/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {BindingScope, injectable, service} from '@loopback/core';
import {Logger} from '@tsed/logger';
import {EventFilter, utils} from 'ethers';
import {Status, Swap, Type} from '../models';
import {SwapService} from './swap.service';
import {TokenService} from './token.service';

@injectable({scope: BindingScope.SINGLETON})
export class Events {
  // Create static instance
  private static instance: Events;
  private logger;
  // Property that describe status of websocket
  // prevent double events on one chanel
  private isListening: Boolean = false;
  private status: Boolean = true;
  // Constructor for event services
  constructor(
    @service() private tokenService: TokenService,
    @service() private swapService: SwapService,
  ) {
    this.logger = new Logger('Events');
    this.logger.appenders
      .set('everything', {
        type: 'file',
        filename: `${__dirname}/../../logs/event-logs.log`,
      })
      .set('console-log', {
        type: 'console',
      });
  }

  async newSwap() {
    this.status = true;
    if (!this.isListening) {
      this.logger.info(
        `Events: swap server started at: ${new Date().toLocaleString()}`,
      );
      const tokenContract = this.tokenService.getTokenContract();
      const depositAddress = this.tokenService.getDepositAddress();

      const filter: EventFilter = {
        address: tokenContract.address,
        topics: [utils.id('Transfer(address,address,uint256)')],
      };

      tokenContract.on(filter, async (from, to, value, transactionDetail) => {
        if (!this.status) {
          this.logger.info(
            `Events: New swap are detected but server are paused. From: ${from}, value: ${value}`,
          );
        } else {
          if (to === depositAddress) {
            this.logger.info(
              `Events: new swap are detected. From: ${from}, value: ${value}`,
            );
            const newSwapRecord = new Swap({
              txid: transactionDetail.transactionHash,
              blockNumber: transactionDetail.blockNumber,
              from,
              to,
              value,
              type: Type.WXPX,
              status: Status.PENDING,
              createdAt: new Date(Date.now()),
            });

            this.swapService.createRecord(newSwapRecord);

            this.logger.info(
              `Events: Created swap record for ${newSwapRecord.txid}`,
            );
          }
        }
      });
      this.isListening = true;
    } else {
      this.logger.error(
        `Events: Duplicate events are not authorized for running`,
      );
    }
  }

  pauseServer() {
    if (!this.status) {
      throw new Error('Server is not running');
    }

    this.status = false;
    this.logger.info(`Events: Swap Server Paused`);
    return this.status;
  }
}
