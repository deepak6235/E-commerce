import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "../auth/auth.entity";


@Entity('user_table')

export class User{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false , type:'varchar' , length:50})
    name:string;

    @Column({type:'int' , nullable:false})
    age:number

    @Column({type:'varchar' , length:50 , nullable:false})
    email:string

    @Column({type:'varchar' , length:15 ,nullable:false})
    phone:string

    @OneToOne(()=>Auth,{onDelete:'CASCADE'})
    @JoinColumn({name:'auth_table'})
    auth:Auth

}