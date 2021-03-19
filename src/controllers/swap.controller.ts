/* eslint-disable @typescript-eslint/no-floating-promises */
// Uncomment these imports to begin using these cool features!

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
import {SwapRepository} from '../repositories';
import {
  ConnectionService,
  Events,
  TokenService,
  VerifierService,
} from '../services';

export interface VerifyMessage {
  address: string;
  messageSignature: BytesLike;
  originMessage: string;
}
export interface TransferData {
  address: string;
  value: number;
}

export class SwapController {
  @inject(RestBindings.Http.REQUEST) private req: Request;
  @inject(RestBindings.Http.RESPONSE) private res: Response;

  @service() private connectionService: ConnectionService;

  constructor(
    @service() private eventService: Events,
    @service() private verifierService: VerifierService,
    @service() private tokenService: TokenService,
    @repository(SwapRepository) public swapRepository: SwapRepository,
  ) {}

  @get('/start-swap-server')
  @response(200)
  async startServer(): Promise<Response> {
    try {
      this._startSwapServer();
      return this.res.status(200).send({
        status: true,
        data: `Server is STARTED at. ${new Date().toLocaleString()}`,
      });
    } catch (error) {
      return this.res.status(401).send({
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

      if (
        recoveredAddress.toLowerCase() !== verifyMessage.address.toLowerCase()
      ) {
        throw new Error('Signer address different from derived address');
      }

      const depositWxpxRecord = await this.swapRepository.findOne({
        where: {from: recoveredAddress},
      });

      if (!depositWxpxRecord) {
        throw new Error('Transfer WXPX record not found!');
      }

      const transaction = await this.tokenService.transferWxpx(
        depositWxpxRecord.from,
        depositWxpxRecord.value,
      );

      return this.res.status(200).send({
        status: true,
        data: `${transaction.hash}`,
      });
    } catch (error) {
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

      return this.res.status(200).send({
        status: true,
        data: transferResponse,
      });
    } catch (error) {
      return this.res.status(500).send({
        status: false,
        message: error.message,
      });
    }
  }
}
