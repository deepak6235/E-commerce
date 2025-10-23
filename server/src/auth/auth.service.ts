import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authtable:Repository<Auth>,

        @InjectRepository(User)
        private usertable:Repository<User>,

        private jwtService : JwtService
    ){}
   
async login(username: string, password: string) {

  if (!username || !password) {
    throw new BadRequestException('Username and password are required');
  }
  let auth = await this.authtable.findOne({
    where: { username: username },
  });

  if (!auth) {
    const user = await this.usertable.findOne({
      where: { email: username },
      relations: ['auth'],
    });

    if (!user || !user.auth) {
      throw new UnauthorizedException('Invalid username or email');
    }

    auth = user.auth;
  }

  const isValidPass = await bcrypt.compare(password, auth.password);
  if (!isValidPass) {
    throw new UnauthorizedException('Invalid password');
  }

  console.log(auth.id)

  const payload = { id: auth.id, username: auth.username, role: auth.role };
  const token = this.jwtService.sign(payload);

  return {
    message: 'Login successful',
    token,
    role: auth.role,
    username: auth.username,
    id: auth.id,
  };
}





}
