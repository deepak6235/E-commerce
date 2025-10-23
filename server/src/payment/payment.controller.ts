// payment.controller.ts
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPaymentByOrder(@Param('id') orderId: number) {
    console.log(orderId)
    return this.paymentService.getPaymentByOrderId(orderId);
  }
}
