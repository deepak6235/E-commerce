import { Controller, Get, Param, Patch, Body,Request, UseGuards } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';




@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get('admin/:orderId')
  async AdmingetShipmentByOrder(@Param('orderId') orderId: number) {
    return this.shipmentService.AdmingetShipmentByOrder(orderId);
  }


  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  async getShipmentByOrder(@Param('orderId') orderId: string, @Request() req) {
    const userId = req.user.id;
    return this.shipmentService.getShipmentByOrder(orderId, userId);
  }
  
}




