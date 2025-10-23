import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Payment } from '../payment/payment.entity';
import { Shipment } from '../shipment/shipment.entity';
import { Review } from '../review/review.entity';
import { Order } from '../order/order.entity';
import { Auth } from '../auth/auth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User,Payment,Shipment,Review,Order,Auth]),

  JwtModule.register({
    secret: 'yourSecretKeyHere',
    signOptions: { expiresIn: '1h' },
  })
],
  
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
