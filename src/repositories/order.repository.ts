import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Lb4NewDataSource} from '../datasources';
import {Order, OrderRelations, Cart} from '../models';
import {CartRepository} from './cart.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {

  public readonly carts: HasManyRepositoryFactory<Cart, typeof Order.prototype.id>;

  constructor(
    @inject('datasources.lb4new') dataSource: Lb4NewDataSource, @repository.getter('CartRepository') protected cartRepositoryGetter: Getter<CartRepository>,
  ) {
    super(Order, dataSource);
    this.carts = this.createHasManyRepositoryFactoryFor('carts', cartRepositoryGetter,);
    this.registerInclusionResolver('carts', this.carts.inclusionResolver);
  }
}
