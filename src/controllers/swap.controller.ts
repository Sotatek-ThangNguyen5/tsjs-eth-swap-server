// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, Request, response, RestBindings} from '@loopback/rest';
import {SwapRepository} from '../repositories';
import {ConnectionService} from '../services';

export class SwapController {
  @inject(RestBindings.Http.REQUEST) private req: Request;
  @service() private connectionService: ConnectionService;

  constructor(
    @repository(SwapRepository) private swapRepository: SwapRepository,
  ) {}

  @get('/start-swap-server')
  @response(200)
  async swap(): Promise<string> {
    this._startSwapServer();
    return 'Server started';
  }

  _startSwapServer() {}
}
