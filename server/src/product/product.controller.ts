import { 
  BadRequestException,
  Body, Controller, Delete, Get, Param, Patch, Post, Put,Request, Query, UploadedFile, UseGuards, UseInterceptors 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async UsergetProducts(
    @Request() req,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const authId = req.user.id;
    console.log(authId)
    return this.productService.UsergetProducts(authId, search, category);
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('user/details/:id')
  async getProductDetailsForUser(
    @Param('id') productId: number,
    @Request() req
  ) {
    const authId = req.user.id;
    return this.productService.getProductDetailsForUser(productId, authId);
  }
  


  @Get('details/:id')
  async getProductDetails(@Param('id') id: number) {
    return this.productService.getProductWithReviews(id);
  }


  @Get()
  async getProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.productService.findAll(search, category);
  }


  
  @Get(':id')
  async getProduct(@Param('id') id: number) {
    return this.productService.findOne(id);
  }


  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const safeName = file.originalname.replace(/\s+/g, '-');
          const filename = Date.now() + '-' + safeName;
          cb(null, filename);
        },
      }),
    }),
  )
  async addProduct(@UploadedFile() image: Express.Multer.File, @Body() body: any) {
    if (!image) {
      throw new BadRequestException('Product image is required');
    }
  
    const data: Partial<Product> = {
      ...body,
      image: image.filename, 
    };
    return this.productService.create(data);
  }
  


  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const safeName = file.originalname.replace(/\s+/g, '-');
          const filename = Date.now() + '-' + safeName;
          cb(null, filename);
        },
      }),
    }),
  )
  async editProduct(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: any,
  ) {
    const data: Partial<Product> = {
      ...body,
      image: image ? image.filename : body.image, 
    };
    return this.productService.update(id, data);
  }

  // DELETE product
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.remove(id);
  }



  /////////////user view products ///////
  
















}
