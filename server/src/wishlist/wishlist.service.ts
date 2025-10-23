// wishlist.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { WishList } from './wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishList)
    private wishlistRepo: Repository<WishList>,

    @InjectRepository(User)
    private UserRepo: Repository<User>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,


  ) {}


  async addToWishlist(user: User, product: Product) {
    const exists = await this.isInWishlist(user.id, product.id);
    if (exists) return exists;

    const item = this.wishlistRepo.create({ user, product });
    return this.wishlistRepo.save(item);
  }

  async removeFromWishlist(user: User, product: Product) {
    return this.wishlistRepo.delete({
      user: { id: user.id },
      product: { id: product.id },
    });
  }

  async isInWishlist(userId: number, productId: number) {
    const item = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    return !!item;
  }



  async getUserWishlist(userId: number) {
    const items = await this.wishlistRepo.find({
      where: { user: { auth:{id:userId} } },
      relations: ['product'],
    });
    console.log(items)
    return items.map((w) => w.product);
  }








// Wishlist Service
async toggleLike(productId: number, authId: number) {
  // Fetch the user entity by authId
  const user = await this.UserRepo.findOne({
    where: { auth: { id: authId } },
    relations: ['auth'],
  });
  if (!user) throw new Error('User not found for this auth ID');

  // Fetch the product entity
  const product = await this.productRepo.findOne({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  // Check if already in wishlist
  const existingLike = await this.wishlistRepo.findOne({
    where: { product: { id: product.id }, user: { id: user.id } },
    relations: ['product', 'user'],
  });

  if (existingLike) {
    await this.wishlistRepo.remove(existingLike);
    return { liked: false };
  } else {
    const newLike = this.wishlistRepo.create({ product, user });
    await this.wishlistRepo.save(newLike);
    return { liked: true };
  }
}






  
}
