import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'Permissions'
})
export class Permissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        comment: '权限代码'
    })
    code: string;

    @Column({
        length: 100,
        comment: '权限描述'
    })
    description: string;
}