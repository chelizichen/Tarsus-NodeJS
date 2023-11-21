import { Column, Entity, LeftJoin, PrimaryGenerateColumn } from '../../../../lib/httpservice'
@Entity('users')
class User {
    @PrimaryGenerateColumn({})
    public id: number;

    @Column({ type: "varchar", length: 255 })
    public username: string;

    @Column({ type: "varchar", length: 255 })
    public password: string;

    @Column({ type: "varchar", length: 255 })
    public email: string;

    @Column({ type: "phone", length: 255 })
    public phone: string;

    @Column({ type: "varchar", length: 255 })
    public createTime: string;

    @Column({ type: "varchar", length: 255 })
    public updateTime: string;


    @Column({ type: "varchar", length: 255 })
    public roleName: string;


    @Column({ type: "varchar", length: 255 })
    public level: string;

}

export default User;