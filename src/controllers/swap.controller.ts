/* eslint-disable @typescript-eslint/no-floating-promises */
// Uncomment these imports to begin using these cool features!

import {isAddress} from '@ethersproject/address';
import {BytesLike} from '@ethersproject/bytes';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  post,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {Logger} from '@tsed/logger';
import {Status, Type} from '../models';
import {SwapRepository} from '../repositories';
import {Events, TokenService, VerifierService} from '../services';
import {SiriusService} from '../services/sirius.service';

export interface VerifyMessage {
  address: string;
  messageSignature: BytesLike;
  originMessage: string;
}
export interface TransferData {
  address: string;
  value: number;
  txid: string;
}

export class SwapController {
  @inject(RestBindings.Http.REQUEST) private req: Request;
  @inject(RestBindings.Http.RESPONSE) private res: Response;

  @service() private eventService: Events;
  @service() private verifierService: VerifierService;
  @service() private tokenService: TokenService;
  @service() private siriusService: SiriusService;
  @repository(SwapRepository) public swapRepository: SwapRepository;

  private logger;

  constructor() {
    // Init Logger
    this.logger = new Logger('Swap');
    this.logger.appenders
      .set('everything', {
        type: 'file',
        filename: `${__dirname}/../../logs/swap-logs.log`,
      })
      .set('console-log', {
        type: 'console',
      });
  }

  @get('/start-swap-server')
  @response(200)
  async startServer(): Promise<Response> {
    try {
      this._startSwapServer();
      this.logger.info('Server started');
      return this.res.status(200).send({
        status: true,
        data: `Server is STARTED at. ${new Date().toLocaleString()}`,
      });
    } catch (error) {
      this.logger.error(`Fatal error:startServer: ${error.message}`);
      return this.res.status(400).send({
        status: false,
        message: error.message,
      });
    }
  }

  @get('/pause-swap-server')
  @response(200)
  async pauseServer(): Promise<Response> {
    try {
      this.eventService.pauseServer();
      return this.res.status(200).send({
        status: true,
        data: `Server is PAUSED at. ${new Date().toLocaleString()}`,
      });
    } catch (error) {
      this.logger.error(`Fatal error:pauseServer: ${error.message}`);
      return this.res.status(401).send({
        status: false,
        message: error.message,
      });
    }
  }

  _startSwapServer() {
    this.eventService.newSwap();
  }

  @post('/verify-message')
  @response(200)
  async verifyMessage(
    @requestBody() verifyMessage: VerifyMessage,
  ): Promise<Response> {
    try {
      const recoveredAddress: string = this.verifierService.verifyMessage(
        verifyMessage.originMessage,
        verifyMessage.messageSignature,
      );
      const [transactionId, xpxAddress] = verifyMessage.originMessage.split(
        '|',
      );

      if (!transactionId || !xpxAddress) {
        throw new Error('Signed Message not valid');
      }

      if (
        recoveredAddress.toLowerCase() !== verifyMessage.address.toLowerCase()
      ) {
        throw new Error('Signer address different from derived address');
      }

      const depositWxpxRecord = await this.swapRepository.findOne({
        where: {
          from: recoveredAddress,
          txid: transactionId,
          status: Status.PENDING,
        },
      });

      if (!depositWxpxRecord) {
        throw new Error('Transfer WXPX record not found or fulfilled!');
      }

      this.logger.info(`REQUEST::${depositWxpxRecord.from} requested a swap`);

      const siriusResponse = await this.siriusService.transferXpxtoAddress(
        xpxAddress,
        depositWxpxRecord.txid,
      );

      this.logger.info(`SIRIUS RESPONSE: ${JSON.stringify(siriusResponse)}`);
      if (!siriusResponse.status) {
        throw new Error('Received failed, try again later');
      }

      const siriusTransferTransaction = siriusResponse.data;

      await this.swapRepository.updateById(depositWxpxRecord._id, {
        status: Status.FULFILLED,
        fulfillTransaction: siriusTransferTransaction.hash,
      });

      this.logger.info(
        `REQUEST FULFILLED::${depositWxpxRecord.from} by ${siriusTransferTransaction.hash}`,
      );

      return this.res.status(200).send({
        status: true,
        data: `${siriusTransferTransaction.hash}`,
      });
    } catch (error) {
      this.logger.error(`Fatal error:verifyMessage: ${error.message}`);
      return this.res.status(401).send({
        status: false,
        message: error.message,
      });
    }
  }

  @post('/transfers')
  @response(200)
  async transferWxpx(
    @requestBody() transferData: TransferData,
  ): Promise<Response> {
    try {
      const transferResponse = await this.tokenService.transferWxpx(
        transferData.address,
        transferData.value,
      );

      if (!isAddress(transferData.address)) {
        throw new Error('Invalid ethereum address format');
      }

      if (!transferResponse.hash) {
        throw new Error('Transfer failed by provider error - try again later');
      }

      await this.swapRepository.create({
        txid: transferData.txid,
        value: transferData.value,
        from: this.tokenService.getAccountAddress(),
        to: transferData.address,
        type: Type.XPX,
        status: Status.FULFILLED,
        fulfillTransaction: transferResponse.hash,
      });

      return this.res.status(200).send({
        status: true,
        data: {
          nonce: transferResponse.nonce,
          gasPrice: parseInt(transferResponse.gasPrice),
          gasLimit: parseInt(transferResponse.gasLimit),
          hash: transferResponse.hash,
        },
      });
    } catch (error) {
      this.logger.error(`Fatal error:transferWxpx: ${error.message}`);
      return this.res.status(400).send({
        status: false,
        message: error.message,
      });
    }
  }
}
