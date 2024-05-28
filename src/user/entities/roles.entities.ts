import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permissions } from './permissions.entities'

@Entity({
    name: 'roles'
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20, //列类型的长度。 例如，如果要创建varchar（150）类型，请指定列类型和长度选项
        comment: '角色名' //数据库列备注，并非所有数据库类型都支持
    })
    name: string

    @ManyToMany(() => Permissions)
    @JoinTable({
        name: 'role_permissions'
    })
    permissions: Permissions[]
}