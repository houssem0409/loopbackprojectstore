import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Lb4NewDataSource} from '../datasources';
import {Cart, CartRelations, Product, Item} from '../models';
import {ProductRepository} from './product.repository';
import {ItemRepository} from './item.repository';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.id,
  CartRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Cart.prototype.id>;

  public readonly items: HasManyRepositoryFactory<Item, typeof Cart.prototype.id>;

  constructor(
    @inject('datasources.lb4new') dataSource: Lb4NewDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('ItemRepository') protected itemRepositoryGetter: Getter<ItemRepository>,
  ) {
    super(Cart, dataSource);
    this.items = this.createHasManyRepositoryFactoryFor('items', itemRepositoryGetter,);
    this.registerInclusionResolver('items', this.items.inclusionResolver);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
