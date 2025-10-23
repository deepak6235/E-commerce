import { Controller, Post, Req, Body, UseGuards, Get } from '@nestjs/common';

import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}




  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserOrders(@Req() req) {
    const userId = req.user.id;
    console.log(userId,'diowjfjklqjlev')
    return this.ordersService.getUserOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Req() req, @Body() body: any) {
    const userId = req.user.id;
    const { productId, quantity, paymentResponse, shippingDetails} = body;

    console.log('payment' , paymentResponse.status)

    return this.ordersService.createOrder(userId, productId, quantity, paymentResponse, shippingDetails);
  }


  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async purchase(@Req() req, @Body() body: any) {
    const user = req.user.id;
    const { productId, quantity, paymentResponse, shippingDetails} = body;

    console.log('payment' , paymentResponse.status)

    return this.ordersService.purchase(user, productId, quantity, paymentResponse, shippingDetails);
  }






}
