import {Entity, model, property} from '@loopback/repository';

export enum Type {
  WXPX = 'WXPX', // Transaction that convert WXPX to XPX
  XPX = 'XPX', // Transaction that convert XPX to WXPX
}

@model()
export class Swap extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
    id: true,
    index: {
      unique: true,
    },
  })
  txid: string;

  @property({
    type: 'number',
    required: true,
  })
  blockNumber: number;

  @property({
    type: 'number',
    required: true,
  })
  value: number;

  @property({
    type: 'string',
    required: true,
  })
  from: string;

  @property({
    type: 'string',
    required: true,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  type: Type;

  constructor(data?: Partial<Swap>) {
    super(data);
  }
}

export interface SwapRelations {
  // describe navigational properties here
}

export type SwapWithRelations = Swap & SwapRelations;
