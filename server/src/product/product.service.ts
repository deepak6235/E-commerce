import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { Review } from '../review/review.entity';
import { WishList } from '../wishlist/wishlist.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(WishList)
    private readonly wishlistRepo: Repository<WishList>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
  ) {}

  async findAll(search?: string, category?: string) {
    const query = this.productRepo.createQueryBuilder('product');

    if (search) {
      query.andWhere('product.name LIKE :search OR product.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    const products = await query.getMany();

    const categoriesData = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    const categories = categoriesData.map((c) => c.category);

    return { products, categories };
  }





  async findOne(id: number) {
    return this.productRepo.findOne({ where: { id } });
  }


  async getProductWithReviews(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    console.log('pid',product)

    if (!product) throw new NotFoundException('Product not found');

    // get reviews with user info
    const reviews = await this.reviewRepo.find({
      where: { product: { id } },
      relations: ['user'],
      order: { reviewed_at: 'DESC' },
    });

    return { product, reviews };
  }

  
  async create(data: Partial<Product>) {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id: number, data: Partial<Product>) {
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.productRepo.delete(id);
  }





  async UsergetProducts(userId: number, search?: string, category?: string) {
    const where: any = {};
  
    if (search) {
      where.name = Like(`%${search}%`);
    }
  
    if (category) {
      where.category = category;
    }
  
    const products = await this.productRepo.find({ where });
  
    const categories = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();
  
    const wishlistItems = await this.wishlistRepo.find({
      where: { user: { auth:{id:userId} } },
      relations: ['product'],
    });
  
    const wishlistProductIds = wishlistItems.map((w) => w.product.id);
  
    const productsWithWishlist = products.map((p) => ({
      ...p,
      isInWishlist: wishlistProductIds.includes(p.id),
    }));
  
    return {
      products: productsWithWishlist,
      categories: categories.map((c) => c.category),
    };
  }
  




  async getProductDetailsForUser(productId: number, authId: number) {
    const user = await this.userRepo.findOne({
      where: { auth: { id: authId } },
    });
    if (!user) throw new NotFoundException('User not found');
  
    const userId = user.id; 
  
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
  
    const reviews = await this.reviewRepo.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { reviewed_at: 'DESC' },
    });
  
    const reviewsWithPermissions = reviews.map(r => ({
      ...r,
      canEdit: r.user.id === userId, 
    }));
  
    const purchased = await this.orderRepo.count({
      where: { user: { id: userId }, product: { id: productId } },
    });
    const canReview = purchased > 0;
  
    const wishlistItem = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    const isInWishlist = !!wishlistItem;
  
    return {
      product,
      reviews: reviewsWithPermissions,
      canReview,
      isInWishlist,
    };
  }
  
  
  
  





}
