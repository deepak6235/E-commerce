import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Cart } from '../cart/cart.entity';
import { Payment } from '../payment/payment.entity';
import { Shipment } from '../shipment/shipment.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order,Cart,Payment,Shipment,Product,User])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
