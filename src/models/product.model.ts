import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {Category} from './category.model';
import {Cart} from './cart.model';
import {Item} from './item.model';

@model({settings: {strict: false}})
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  sku?: string;

  @property({
    type: 'string',
  })
  categoryId?: string;

  @hasOne(() => Category)
  category: Category;

  @property({
    type: 'string',
  })
  cartId?: string;

  @hasMany(() => Cart)
  carts: Cart[];

  @hasMany(() => Item)
  items: Item[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
