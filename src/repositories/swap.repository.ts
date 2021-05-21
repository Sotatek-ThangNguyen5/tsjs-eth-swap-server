import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Swap} from '../models';

export class SwapRepository extends DefaultCrudRepository<
  Swap,
  typeof Swap.prototype.txid
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Swap, dataSource);
  }
}
