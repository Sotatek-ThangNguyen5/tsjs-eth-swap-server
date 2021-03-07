// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {get, Request, response, RestBindings} from '@loopback/rest';
import {ConnectionService} from '../services';

export class SwapController {
  @inject(RestBindings.Http.REQUEST) private req: Request;
  @service() private connectionService: ConnectionService;

  constructor() {}

  @get('/start-swap-server')
  @response(200)
  swap(): string {
    this._startSwapServer();

    return 'Server Started';
  }

  _startSwapServer() {}
}
