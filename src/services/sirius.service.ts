import {BindingScope, injectable} from '@loopback/core';
import axios from 'axios';
import {BytesLike} from 'ethers';
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

  async transferXpxtoAddress(to: string, ethTransactionId: BytesLike, signature: BytesLike) {
    try {
      const data = JSON.stringify({
        siriusRecipient: to,
        signature,
        txnInfo: {
          network: 'ETH',
          txnHash: ethTransactionId,
        },
      });
      const response = await axios.post(`${this.url}/xpx/transfer`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === "Success") {
        throw new Error("Transaction Claimed");
      }

      if (response.data.status === "inProgress") {
        return {
          status: true,
          data: response.data
        };
      }

      if (!response.data || !response.data.siriusSwapInfo || response.data.siriusSwapInfo.status.status !== 'Success') {
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
      const jsonData = await data.toJSON();
      const value = jsonData.transaction.mosaics[0].amount[0];
      const message = JSON.parse(data.message.payload);
      return {
        status: true,
        value: value,
        address: message.Swap.signer,
        hash: message.Swap.hash,
        gasLevel: message.Swap.gasLevel,
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
      const transactionStatus: any = await this.getTransactionStatusPromise(txhash);
      if (transactionStatus.status !== "Success") {
        return false;
      }
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
          resolve(rs);
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
