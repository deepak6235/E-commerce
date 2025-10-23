import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService:UserService
    ){}

    
//////////user view users profile/////////////

    @UseGuards(JwtAuthGuard)
    @Get('profile')
      async getProfile(@Req() req) {
      const userId = req.user.id;
       console.log(userId)
        return this.userService.getProfile(userId);
      }









      @UseGuards(JwtAuthGuard)
  @Patch('update/profile')
  async updateProfile(@Req() req, @Body() data: any) {
    const userId = req.user.id;
    console.log(userId)
    return this.userService.updateProfile(userId, data);
  }

///////////////////user change password////////////


@UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Req() req, @Body() data: any) {
    const userId = req.user.id;
    const { currentPassword, newPassword } = data;
    return this.userService.changePassword(userId, currentPassword, newPassword);
  }


    





/////////////////////user register /////////////////

@Post('register')
async register(
    @Body()
    body: {
        username: string,
        password:string,
        name:string,
        email:string,
        phone:string,
        age:number
    },


)  {
    return this.userService.register(body)
}



    ////////////admin view all users//////////


    @Get()
    async getUsers(@Query('search') search?: string) {
      return this.userService.getUsers(search);
    }




    /////////admin view single user order////////////


    @Get(':id/details')
    async getUserOrderDetails(@Param('id') id: number) {
      return this.userService.getUserOrderDetails(id);
    }









}
