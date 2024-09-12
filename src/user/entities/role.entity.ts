import { Permission } from "./permission.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name:'roles'
})

export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        length:20,
        comment:'角色名'
    })
    name:string;


    //多对多的表关系
    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permissions'
    })
    permissions: Permission[]
}