/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {BindingScope, injectable, service} from '@loopback/core';
import {Logger} from '@tsed/logger';
import {Status, Swap, Type} from '../models';
import {ConnectionService} from './connection.service';
import {SwapService} from './swap.service';
import {TokenService} from './token.service';

@injectable({scope: BindingScope.SINGLETON})
export class Events {
  private logger;
  // Property that describe status of websocket
  // prevent double events on one chanel
  private isListening: Boolean = false;
  private status: Boolean = true;
  private provider: any;
  // Constructor for event services
  @service() private tokenService: TokenService;
  @service() private swapService: SwapService;
  @service() private connectionService: ConnectionService;

  constructor() {
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
    this.provider = this.connectionService.getProvider();
    this.status = true;
    if (!this.isListening) {
      this.logger.info(
        `Events: swap server started at: ${new Date().toLocaleString()}`,
      );
      const tokenContract = this.tokenService.getTokenContract();
      const depositAddress = this.tokenService.getDepositAddress();

      const queryFilter = tokenContract.filters.Transfer(
        null,
        depositAddress,
      );

      this.provider.on('block', (newBlock: any) => {
        tokenContract.queryFilter(queryFilter, -30).then(async (transactionList) => {
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < transactionList.length; i++) {
            const transaction = transactionList[i];
            if (!transaction || !transaction.args) {
              console.log("Record empty");
              continue;
            }

            const from = transaction.args.from;
            const value = transaction.args.value;
            const to = transaction.args.to;
            const hash = transaction.transactionHash;
            const blockNumber = transaction.blockNumber;

            const record = await this.swapService.findByHash(hash);

            if (record) {
              continue;
            }

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
                  txid: hash,
                  blockNumber,
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
          }
        });
      })
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
