import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Review,Product,User])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
