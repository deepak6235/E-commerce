// wishlist.controller.ts
import { Controller, Get, Post, Delete, Body, Request, UseGuards, Param, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Product } from '../product/product.entity';


@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}









  @UseGuards(JwtAuthGuard)
  @Post('toggle')
  async toggleLike(@Body('productId') productId: number, @Req() req) {
    const authId = req.user.id;
    console.log(authId, "this is liking user");
    return this.wishlistService.toggleLike(productId, authId);
  }




  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserWishlist(@Request() req) {
    return this.wishlistService.getUserWishlist(req.user.id);
  }


  
}
