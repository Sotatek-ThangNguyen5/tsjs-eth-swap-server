/* eslint-disable @typescript-eslint/no-floating-promises */
// Uncomment these imports to begin using these cool features!

import {BytesLike} from '@ethersproject/bytes';
import {inject, service} from '@loopback/core';
import {
  get,
  post,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {ConnectionService, Events, VerifierService} from '../services';

export interface VerifyMessage {
  address: string;
  messageSignature: BytesLike;
  originMessage: string;
}

export class SwapController {
  @inject(RestBindings.Http.REQUEST) private req: Request;
  @inject(RestBindings.Http.RESPONSE) private res: Response;

  @service() private connectionService: ConnectionService;

  constructor(
    @service() private eventService: Events,
    @service() private verifierService: VerifierService,
  ) {}

  @get('/start-swap-server')
  @response(200)
  async swap(): Promise<string> {
    this._startSwapServer();
    return 'Server started';
  }

  _startSwapServer() {
    this.eventService.newSwap();
  }

  @post('/verify-message')
  @response(200)
  verifyMessage(@requestBody() verifyMessage: VerifyMessage): Response {
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

      return this.res.status(200).send({
        status: true,
        message: `${verifyMessage.address} did sign the message: ${verifyMessage.originMessage}`,
      });
    } catch (error) {
      return this.res.status(401).send({
        status: false,
        message: error.message,
      });
    }
  }
}
