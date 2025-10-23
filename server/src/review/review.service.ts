import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async addReview(
    user: User,
    product: Product,
    reviewText: string,
    rating: number,
    image?: string,
  ) {


    const userEntity = await this.userRepo.findOne({
      where: { auth: { id: user.id } },
    });
    if (!userEntity) throw new Error('User not found');
  
    const productEntity = await this.productRepo.findOne({ where: { id: product.id } });
    if (!productEntity) throw new Error('Product not found');
  
    const existing = await this.reviewRepo.findOne({
      where: { user: { id: user.id }, product: { id: product.id } },
    });
  
    if (existing) {
      return { success: false, message: 'You have already reviewed this product', review: existing };
    }
  
    const review = this.reviewRepo.create({
      user: userEntity,
      product: productEntity,
      review: reviewText,
      rating,
      image,
    });
  
    const savedReview = await this.reviewRepo.save(review);
    return { success: true, review: savedReview };
  }
  
  async editReview(
    reviewId: number,
    userId: number,
    text: string,
    rating: number,
    image?: string,
  ) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId, user: {auth:{id:userId}} },
    });
    if (!review) throw new NotFoundException('Review not found');
  
    review.review = text;
    review.rating = rating;
    if (image) review.image = image;
  
    return this.reviewRepo.save(review);
  }
  

  async deleteReview(reviewId: number, userId: number) {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId, user: {auth:{id:userId}} } });
    if (!review) throw new NotFoundException('Review not found');

    return this.reviewRepo.delete(reviewId);
  }

  async getReviewsForProduct(productId: number) {
    return this.reviewRepo.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { reviewed_at: 'DESC' },
    });
  }
}
