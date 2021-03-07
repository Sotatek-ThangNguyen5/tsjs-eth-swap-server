import {WebSocketProvider} from '@ethersproject/providers';
import {BindingScope, injectable, service} from '@loopback/core';
import {ConnectionService} from './connection.service';

@injectable({scope: BindingScope.TRANSIENT})
export class WebsocketService {
  private websocketProvider: WebSocketProvider;
  private static instance: WebsocketService;
  private isListening = false;

  constructor(@service() private connectionService: ConnectionService) {
    this.websocketProvider = connectionService.getWssProvider();
  }

  public static getInstance(): WebsocketService {
    if (!WebsocketService.instance) {
      // Get instance of
      const connectionService = new ConnectionService();

      WebsocketService.instance = new WebsocketService(connectionService);
    }

    return WebsocketService.instance;
  }

  async onNewSwapFromWxpx() {}
}
