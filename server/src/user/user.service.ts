import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Like, Repository } from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { Shipment } from '../shipment/shipment.entity';
import { Order } from '../order/order.entity';
import { Review } from '../review/review.entity';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../auth/auth.entity';

@Injectable()
export class UserService {

constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>,

    @InjectRepository(Review)
    private readonly reviewRepo:Repository<Review>,

    @InjectRepository(Order)
    private readonly orderRepo:Repository<Order>,

    @InjectRepository(Payment)
    private readonly paymentRepo:Repository<Payment>,

    @InjectRepository(Shipment)
    private readonly shipmentRepo:Repository<Shipment>,

    @InjectRepository(Auth)
    private readonly authRepo:Repository<Auth>,

    private jwtService :JwtService,

){}


async getUsers(search?: string) {
    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.auth', 'auth'); // join auth table
  
    if (search) {
      query.where(
        'user.name LIKE :search OR user.email LIKE :search OR auth.username LIKE :search',
        { search: `%${search}%` },
      );
    }
  
    return query.orderBy('user.id', 'ASC').getMany();
  }
  

  async getUserOrderDetails(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['auth'],
    });
    console.log(user)

    if (!user) throw new Error('User not found');

    // Orders with products, payments, shipments
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    // Add payment & shipment info to each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const payment = await this.paymentRepo.findOne({
          where: { order: { id: order.id } },
        });
        const shipment = await this.shipmentRepo.findOne({
          where: { order: { id: order.id } },
        });
        return { ...order, payment, shipment };
      }),
    );

    // Reviews with products
    const reviews = await this.reviewRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    return {
      user,
      orders: ordersWithDetails,
      reviews,
    };
  }



  async register (body:{
    username:string,
    password:string,
    name:string,
    email:string,
    phone:string,
    age:number,
}){
    const {username,password,name,email,phone,age} = body;

    const existsuser = await this.authRepo.findOne({where:{username}})
    if (existsuser){
        throw new BadRequestException('username already exist')
    }
     
    const hashedpass = await bcrypt.hash(password,10)

    const auth = this.authRepo.create({
        username,
        password:hashedpass,
        role:'user'
    })

    await this.authRepo.save(auth)




    const user = this.userRepo.create({
        name,
        email,
        phone,
        age,
        auth:auth,

    })

    await this.userRepo.save(user)


    const payload = {username:auth.username,role:auth.role}
    const token = this.jwtService.sign(payload)

    return {
        user,
        token
    }



}









async getProfile(userId: number) {
  const user = await this.userRepo.findOne({
    where : { auth:{id:userId} },
    relations: ['auth'],
  });

  if (!user) throw new UnauthorizedException('User not found');

  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: user.age,
    username: user.auth.username, 
  };

  return profile;
}




async updateProfile(userId: number, updateData: Partial<User> & { username?: string }) {
  const user = await this.userRepo.findOne({
    where: { auth:{id:userId} },
    relations: ['auth'],  
  });

  if (!user) throw new UnauthorizedException('User not found');

  const { username, ...userFields } = updateData;
  Object.assign(user, userFields);
  await this.userRepo.save(user);

  if (username) {
    user.auth.username = username;
    await this.authRepo.save(user.auth);
  }

  return {
    ...user,
    username: user.auth.username,
  };
}


async changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await this.userRepo.findOne({
    where: { auth:{id:userId} },
    relations: ['auth'],
  });

  if (!user) throw new UnauthorizedException('User not found');

  const valid = await bcrypt.compare(currentPassword, user.auth.password);
  if (!valid) throw new UnauthorizedException('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.auth.password = hashedPassword;
  await this.authRepo.save(user.auth);

  return { message: 'Password changed successfully' };
}





}
