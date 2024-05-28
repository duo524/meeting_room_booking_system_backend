import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './roles.entities';

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        comment: '用户名',
    })
    username: string;

    @Column({
        length: 50,
        comment: '密码',
    })
    password: string;

    @Column({
        name: 'nick_name', //数据库表中的列名
        length: 50,
        comment: '昵称'
    })
    nickName: string

    @Column({
        length: 50,
        comment: '邮箱'
    })
    email: string

    @Column({
        comment: '手机号',
        length: 20,
        nullable: true //在数据库中使列NULL或NOT NULL。 默认情况下，列是nullable：false
    })
    phoneNumber: string

    @Column({
        comment: '是否冻结',
        default: false
    })
    isFrozen: boolean;

    @Column({
        comment: '是否是管理员',
        default: false
    })
    isAdmin: boolean;

    @CreateDateColumn()
    createTime: Date; //自动为实体插入日期。无需设置此列，该值将自动设置。

    @UpdateDateColumn()
    updateTime: Date; //在每次调用实体管理器或存储库的save时，自动更新实体日期。无需设置此列，该值将自动设置

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_roles'  //@JoinTable()是@ManyToMany关系所必需的,必须把@JoinTable放在关系的一个（拥有）方
    })
    roles: Role[]
}
