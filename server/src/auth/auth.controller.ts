import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService)
    {}


@Post('login')
async login(@Body() body: {username:string,password:string}){
    return this.authservice.login(body.username, body.password);
}



// @Post('forgot-password')
// async forgotPassword(@Body() body: { email: string; code?: number; newPassword?: string }) {
//   return this.authservice.forgotPasswordFlow(body.email, body.code, body.newPassword);
// }




}
