import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

import { Auth } from './auth/auth.entity';
import { Product } from './product/product.entity';

import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.entity';
import { OrderModule } from './order/order.module';

import { PaymentModule } from './payment/payment.module';
import { ShipmentModule } from './shipment/shipment.module';
import { Order } from './order/order.entity';
import { Shipment } from './shipment/shipment.entity';
import { Payment } from './payment/payment.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/cart.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishList } from './wishlist/wishlist.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',         
      host: 'localhost',     
      port: 3306, 
      username: 'root',     
      password: '123456789',  
      database: 'ecommerce',
      entities:[Auth,Product,User,Review,Order,Shipment,Payment,Shipment,Cart,WishList],  
      synchronize: true,        
    }),
    AuthModule,
    ProductModule,
    UserModule,
    ReviewModule,
    OrderModule,
    PaymentModule,
    ShipmentModule,
    CartModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
