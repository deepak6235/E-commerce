import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Payment } from '../payment/payment.entity';
import { Shipment } from '../shipment/shipment.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Shipment)
    private shipmentRepo: Repository<Shipment>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

  ) {}

  async getProductById(id: number) {
    return this.productRepo.findOne({ where: { id } });
  }






  async createOrder(
    userId: number,
    productId: number,
    quantity: number,
    paymentResponse: any,
    shippingDetails: any,
  ) {
    const user = await this.userRepo.findOne({ where: { auth: { id: userId } } });
    if (!user) throw new Error('User not found');
  
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
  
    if (product.stock <= 0) {
      return { success: false, message: 'Product is out of stock' };
    }
  
    if (product.stock < quantity) {
      return { success: false, message: `Only ${product.stock} items left in stock` };
    }
  
    const totalAmount = quantity * product.price;
  
    const order = this.orderRepo.create({
      user,
      product,
      quantity,
      total: totalAmount,
      status: 'order placed',
    });
    await this.orderRepo.save(order);

    const paymentAmount = totalAmount;
    if (isNaN(paymentAmount)) throw new Error('Payment amount is invalid');
  
    const isPaymentSuccess = paymentResponse.status === 'success';
  
    const payment = this.paymentRepo.create({
      order,
      payment_status: isPaymentSuccess ? 'paid' : 'failed',
      amount: paymentAmount,
      transaction_id: paymentResponse?.razorpay_payment_id,
      type: 'online',
    });
    await this.paymentRepo.save(payment);
  
    if (!isPaymentSuccess) {
      order.status = 'order failed';
      await this.orderRepo.save(order);
      return { success: false, order, payment, message: 'Payment failed, order not processed.' };
    }
  
    product.stock -= quantity;
    await this.productRepo.save(product);
  
    const now = new Date();
    const shippedAt = new Date(now);
    shippedAt.setDate(now.getDate() + 1);
  
    const deliveredAt = new Date(shippedAt);
    deliveredAt.setDate(shippedAt.getDate() + 3);
  
    const shipment = this.shipmentRepo.create({
      order,
      address: shippingDetails.address,
      city: shippingDetails.city,
      state: shippingDetails.state,
      country: shippingDetails.country,
      zip: shippingDetails.zip,
      status: 'Preparing for Shipment',
      shipped_at: shippedAt.toISOString(),
      delivered_at: deliveredAt.toISOString(),
    });
    await this.shipmentRepo.save(shipment);
  
    await this.cartRepo.delete({
      user: { id: user.id },
      product: { id: product.id },
    });
  
    return { success: true, order, payment, shipment, message: 'Order placed successfully.' };
  }
  




  async purchase(
    userId: number,
    productId: number,
    quantity: number,
    paymentResponse: any,
    shippingDetails: any,
  ) {
    const user = await this.userRepo.findOne({ where: { auth: { id: userId } } });
    if (!user) throw new Error('User not found');
  
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
  
    if (product.stock <= 0) {
      return { success: false, message: 'Product is out of stock' };
    }
  
    if (product.stock < quantity) {
      return { success: false, message: `Only ${product.stock} items left in stock` };
    }
  
    const totalAmount = quantity * product.price;
  
    const order = this.orderRepo.create({
      user,
      product,
      quantity,
      total: totalAmount,
      status: 'order placed',
    });
    await this.orderRepo.save(order);
  
    const paymentAmount = totalAmount;
    if (isNaN(paymentAmount)) {
      throw new Error('Payment amount is invalid');
    }
  
    const isPaymentSuccess = paymentResponse.status === 'success';
  
    const payment = this.paymentRepo.create({
      order,
      payment_status: isPaymentSuccess ? 'paid' : 'failed',
      amount: paymentAmount,
      transaction_id: paymentResponse?.razorpay_payment_id,
      type: 'online',
    });
    await this.paymentRepo.save(payment);
  
    if (!isPaymentSuccess) {
      order.status = 'order failed';
      await this.orderRepo.save(order);
      return { success: false, order, payment, message: 'Payment failed, order not processed.' };
    }
  
    product.stock -= quantity;
    await this.productRepo.save(product);
  
    const now = new Date();
    const shippedAt = new Date(now);
    shippedAt.setDate(now.getDate() + 1);
  
    const deliveredAt = new Date(shippedAt);
    deliveredAt.setDate(shippedAt.getDate() + 3);
  
    const shipment = this.shipmentRepo.create({
      order,
      address: shippingDetails.address,
      city: shippingDetails.city,
      state: shippingDetails.state,
      country: shippingDetails.country,
      zip: shippingDetails.zip,
      status: 'Preparing for Shipment',
      shipped_at: shippedAt.toISOString(),
      delivered_at: deliveredAt.toISOString(),
    });
    await this.shipmentRepo.save(shipment);
  
    return { success: true, order, payment, shipment, message: 'Order placed successfully.' };
  }
  
  







  async getUserOrders(userId: number) {
    const orders = await this.orderRepo.find({
      where: { user: { auth:{id:userId} } },
      relations: ['product'], 
      order: { id: 'DESC' },
    });
  

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const payment = await this.paymentRepo.findOne({ where: { order: { id: order.id } } });
        const shipment = await this.shipmentRepo.findOne({ where: { order: { id: order.id } } });
  
        return {
          ...order,
          payment,
          shipment,
        };
      })
    );
  
    return ordersWithDetails;
  }
  
  



}
