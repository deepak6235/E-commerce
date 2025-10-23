import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from './auth.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService,

    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    @InjectRepository(User) private userRepo: Repository<User>,


  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('no jwt secret');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }
  

  async validate(payload: any) {
    return { id: payload.id, username: payload.username, role: payload.role }
    
  }

  
}