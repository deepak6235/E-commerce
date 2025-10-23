import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('auth_table')

export class Auth {

@PrimaryGeneratedColumn()
id:number;

@Column({unique:true , type:'varchar' , nullable:false})
username:string;

@Column({nullable:false , type:'varchar'})
password:string;

@Column( { type:'varchar' , nullable:false})
role:string;



}