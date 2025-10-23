import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity';
import { Order } from '../order/order.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Shipment,Order])],
  providers: [ShipmentService],
  controllers: [ShipmentController]
})
export class ShipmentModule {}