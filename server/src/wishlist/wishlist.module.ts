import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypedEventEmitter } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './wishlist.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([WishList,User,Product])],
  providers: [WishlistService],
  controllers: [WishlistController]
})
export class WishlistModule {}
