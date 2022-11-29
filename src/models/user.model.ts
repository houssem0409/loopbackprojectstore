import {Entity, hasMany, model, property} from '@loopback/repository';
import {Order} from './order.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  lastname: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  phonenumber: string;

  @hasMany(() => Order)
  orders: Order[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
