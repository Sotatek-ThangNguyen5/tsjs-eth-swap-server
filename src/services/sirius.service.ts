import {BytesLike} from '@ethersproject/bytes';
import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {TransactionHttp} from 'tsjs-xpx-chain-sdk';

@injectable({scope: BindingScope.SINGLETON})
export class SiriusService {
  private url = process.env.XPX_SERVER_URL ?? '';
  private API_URL = process.env.XPX_API_URL ?? '';
  private transactionHttp = new TransactionHttp(this.API_URL);

  constructor() { }

  async checkHealth() {
    const response = await axios.get(`${this.url}/check-health`);
    return response.data;
  }

  async transferXpxtoAddress(to: string, ethTransactionId: BytesLike) {
    try {
      const data = JSON.stringify({
        siriusRecipient: to,
        txnInfo: {
          network: 'ETH',
          txnHash: ethTransactionId,
        },
      });
      const response = await axios.post(`${this.url}/transfer-xpx`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status !== 'Success') {
        throw new Error(response.data.status);
      }

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

  async getTransactionDetail(txhash: string) {
    try {
      const data: any = await this.getTransactionPromise(txhash);
      return {
        status: true,
        value: parseInt(data.transaction.mosaics[0].amount[0]),
      };
    } catch (error) {
      return {
        status: false,
        value: 0,
        error: error.message,
      };
    }
  }

  async getTransactionStatus(txhash: string) {
    try {
      await this.getTransactionStatusPromise(txhash);
      return true;
    } catch (error) {
      return false;
    }
  }

  getTransactionPromise(txhash: any) {
    let error = false;
    return new Promise((resolve, reject) => {
      try {
        this.transactionHttp.getTransaction(txhash).subscribe(rs => {
          const response: any = rs.toJSON();
          resolve(response);
        }, err => {
          error = err;
        });

        if (error) {
          reject(error);
        }
      } catch (err) {
        reject(err.message);
      }
    });
  }

  getTransactionStatusPromise(txhash: any) {
    return new Promise((resolve, reject) => {
      try {
        this.transactionHttp.getTransactionStatus(txhash).subscribe(rs => {
          resolve(rs);
        }, err => {
          reject(err);
        });
      } catch (err) {
        reject(err.message);
      }
    });
  }
}
