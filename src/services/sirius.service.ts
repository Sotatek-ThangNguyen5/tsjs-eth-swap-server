import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';

@injectable({scope: BindingScope.SINGLETON})
export class SiriusService {
  private url = process.env.XPX_SERVER_URL ?? '';

  constructor() {}

  async checkHealth() {
    const response = await axios.get(this.url);
    return response.data;
  }
}
