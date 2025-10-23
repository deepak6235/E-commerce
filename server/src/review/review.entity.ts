import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../product/product.entity";
import { User } from "../user/user.entity";

@Entity('review_table')

export class Review{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Product,{nullable:false , onDelete:'CASCADE'})
    @JoinColumn({name:'product_id'})
    product:Product;

    @ManyToOne(()=>User,{nullable:false})
    @JoinColumn({name:'user_id'})
    user:User;

    @Column({type:'text', nullable:false})
    review:string

    @Column({type:'decimal' ,nullable:false, precision:2 , scale:1})
    rating:number;
    
    @Column({type:'varchar', nullable:true})
    image:string

    @Column({type:'timestamp' , nullable:false ,default:()=>'CURRENT_TIMESTAMP'})
    reviewed_at:Date;



}