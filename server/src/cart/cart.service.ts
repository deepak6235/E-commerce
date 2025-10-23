import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "../product/product.entity";
import { User } from "../user/user.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const user = await this.userRepo.findOne({ where: { auth:{id:userId}} });
    const product = await this.productRepo.findOne({ where: { id: productId } });
  
    if (!user || !product) {
      throw new NotFoundException("User or product not found");
    }
  
    const existing = await this.cartRepo.findOne({
      where: { user: { auth:{id:userId} }, product: { id: productId } },
      relations: ["product", "user"],
    });
  
    if (existing) {
      return { 
        success: false, 
        message: 'Item already in cart' 
      };

    }
  
    const newCart = this.cartRepo.create({
      user,
      product,
      quantity,
      total: quantity * Number(product.price),
    });
  
    return this.cartRepo.save(newCart);
  }
  
  

  async getCart(userId: number) {
    const cartItems = await this.cartRepo.find({
      where: { user: { auth:{id:userId} } },
      relations: ["product"],
    });
  
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * Number(item.product.price),
      0
    );
  
    const itemsWithTotal = cartItems.map(item => ({
      ...item,
      total: Number(item.product.price) * item.quantity
    }));
  
    return {
      items: itemsWithTotal,
      subtotal,
    };
  }
  


  async removeItem(cartId: number, userId: number) {
    const cartItem = await this.cartRepo.findOne({
      where: { id: cartId, user: { auth:{id:userId} } },
    });
    if (!cartItem) throw new NotFoundException("Cart item not found");
    return this.cartRepo.remove(cartItem);
  }

  async clearCart(userId: number) {
    await this.cartRepo.delete({ user: { auth:{id:userId} } });
    return { message: "Cart cleared" };
  }


  async updateQuantity(cartId: number, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['product'],
    });

    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = quantity;
    item.total = quantity * Number(item.product.price);
    return this.cartRepo.save(item);
  }








}
