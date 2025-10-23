import { Controller, Post, Get, Body, Req, UseGuards, Delete, Param, Put } from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";



@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("add")
  async addToCart(@Body() body, @Req() req) {
    const userId = req.user.id;
    console.log(userId)
    const { productId, quantity } = body;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.id;
    console.log(userId,'sdfks')
    return this.cartService.getCart(userId);
  }

  
    @Put('update/:id')
    async updateQuantity(@Param('id') id: number, @Body() body) {
      const { quantity } = body;
      return this.cartService.updateQuantity(id, quantity);
    }

  @Delete("remove/:id")
  async removeFromCart(@Param("id") id: number, @Req() req) {
    const userId = req.user.id;
    return this.cartService.removeItem(id, userId);
  }

  @Delete("clear")
  async clearCart(@Req() req) {
    const userId = req.user.id;
    return this.cartService.clearCart(userId);
  }
}
