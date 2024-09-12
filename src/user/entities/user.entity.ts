import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity"


@Entity({
    name:'users',
})


export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        length:50,
        comment:'用户名',
    })   
    username:string;

    @Column({
        length:50,
        comment:'密码',
    })
    password:string;

    @Column({
        length:50,
        comment:'昵称',
    })
    nickname:string;
    
    @Column({
        length:50,
        comment:'邮箱',
    })
    email:string;

    @Column({
        length:50,
        comment:'头像',
    })
    head_picture:string ;

    @Column({
        length:50,
        comment:'手机号',
    })
    phone_number:string;

    @Column({
        comment:'是否被冻结',
        default:false
    })
    isFrozen:boolean;

    @Column({
        comment:'是否是管理员',
        default:false
    })
    isAdmin:boolean;

   @CreateDateColumn()
   createTime:Date;

   @UpdateDateColumn()
   updateTime:Date;

    // 多对多的表关联关系
    @ManyToMany(() => Role)
    @JoinTable({
        name:'user_roles'
    })
    roles:Role[]

}
