import {BytesLike} from '@ethersproject/bytes';
import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';

@injectable({scope: BindingScope.SINGLETON})
export class SiriusService {
  private url = process.env.XPX_SERVER_URL ?? '';

  constructor() {}

  async checkHealth() {
    const response = await axios.get(`${this.url}/check-health`);
    return response.data;
  }

  async transferXpxtoAddress(
    to: string,
    amount: number,
    ethTransactionId: BytesLike,
  ) {
    try {
      const response = await axios.post(`${this.url}/transfer-xpx`, {
        to,
        amount,
        ethTransactionId,
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      return {
        status: false,
        error: error.message,
      };
    }
  }
}