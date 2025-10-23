import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Request,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Product } from '../product/product.entity';
import { extname } from 'path';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const safeName = file.originalname.replace(/\s+/g, '-');
          const ext = extname(file.originalname);
          const imageName = Date.now() + '-' + safeName.replace(ext, '') + ext;
          cb(null, imageName);
        },
      }),
    }),
  )
  async createReview(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { productId: number; text: string; rating: number },
  ) {
    const user = req.user;
    const product = { id: Number(body.productId) } as Product;

    return this.reviewService.addReview(
      user,
      product,
      body.text,
      Number(body.rating),
      file?.filename,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const safeName = file.originalname.replace(/\s+/g, '-');
          const ext = extname(file.originalname);
          const imageName = Date.now() + '-' + safeName.replace(ext, '') + ext;
          cb(null, imageName);
        },
      }),
    }),
  )
  async editReview(
    @Request() req,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { text: string; rating: number },
  ) {
    const user = req.user;

    return this.reviewService.editReview(
      id,
      user.id,
      body.text,
      Number(body.rating),
      file?.filename,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(@Request() req, @Param('id') id: number) {
    const user = req.user;
    return this.reviewService.deleteReview(id, user.id);
  }
}
