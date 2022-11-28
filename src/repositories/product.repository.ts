import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {Lb4NewDataSource} from '../datasources';
import {Product, ProductRelations, Category, Cart, Item} from '../models';
import {CategoryRepository} from './category.repository';
import {CartRepository} from './cart.repository';
import {ItemRepository} from './item.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly category: HasOneRepositoryFactory<Category, typeof Product.prototype.id>;

  public readonly carts: HasManyRepositoryFactory<Cart, typeof Product.prototype.id>;

  public readonly items: HasManyRepositoryFactory<Item, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.lb4new') dataSource: Lb4NewDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('CartRepository') protected cartRepositoryGetter: Getter<CartRepository>, @repository.getter('ItemRepository') protected itemRepositoryGetter: Getter<ItemRepository>,
  ) {
    super(Product, dataSource);
    this.items = this.createHasManyRepositoryFactoryFor('items', itemRepositoryGetter,);
    this.carts = this.createHasManyRepositoryFactoryFor('carts', cartRepositoryGetter,);
    this.category = this.createHasOneRepositoryFactoryFor('category', categoryRepositoryGetter);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
