/* eslint-disable @typescript-eslint/no-floating-promises */
// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {get, post, Request, response, RestBindings} from '@loopback/rest';
import {ConnectionService, Events} from '../services';

export class SwapController {
  @inject(RestBindings.Http.REQUEST) private req: Request;

  @service() private connectionService: ConnectionService;

  constructor(@service() private eventService: Events) {}

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
  verifyMessage() {}
}
