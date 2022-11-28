import {Entity, model, property, hasMany} from '@loopback/repository';
import {Product} from './product.model';
import {Item} from './item.model';

@model({settings: {strict: false}})
export class Cart extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasMany(() => Product)
  products: Product[];

  @property({
    type: 'string',
  })
  productId?: string;

  @hasMany(() => Item)
  items: Item[];

  @property({
    type: 'string',
  })
  orderId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
