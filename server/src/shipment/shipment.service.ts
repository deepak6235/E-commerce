import { Injectable,Logger, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Order } from '../order/order.entity';


@Injectable()
export class ShipmentService {
  private readonly logger = new Logger(ShipmentService.name);
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepo: Repository<Shipment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

async getShipmentByOrder(orderId: string, userId: number): Promise<Shipment> {
  const shipment = await this.shipmentRepo.findOne({
    where: {
      order: { id: parseInt(orderId), user: { auth:{id:userId} } },
    },
    relations: ['order', 'order.user'],
  });

  if (!shipment) {
    throw new Error('Shipment not found or you do not have access');
  }

  return shipment;
}


async AdmingetShipmentByOrder(orderId: number) {
  const shipment = await this.shipmentRepo.findOne({
    where: { order: { id: orderId } },
    relations: ['order', 'order.user', 'order.product'],
  });

  if (!shipment) {
    throw new NotFoundException('Shipment not found for this order');
  }

  return shipment;
}






@Cron(CronExpression.EVERY_10_SECONDS)
async updateShipmentStatus() {
  console.log('cronn');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const shipments = await this.shipmentRepo.find({
    relations: ['order'],
  });

  for (const shipment of shipments) {
    const shippedDate = shipment.shipped_at?.toISOString().split('T')[0];
    const deliveredDate = shipment.delivered_at?.toISOString().split('T')[0];

    if (shippedDate === todayStr && shipment.status === 'Preparing for Shipment') {
      shipment.status = 'Shipped';
      await this.shipmentRepo.save(shipment);
      this.logger.log(`Shipment ${shipment.id} status updated to Shipped`);
    }

    if (deliveredDate === todayStr && shipment.status !== 'Delivered') {
      shipment.status = 'Delivered';
      await this.shipmentRepo.save(shipment);
      this.logger.log(`Shipment ${shipment.id} status updated to Delivered`);

      if (shipment.order) {
        shipment.order.status = 'Delivered';
        await this.orderRepo.save(shipment.order);
        this.logger.log(`Order ${shipment.order.id} status updated to Delivered`);
      }
    }
  }
}







  

}
