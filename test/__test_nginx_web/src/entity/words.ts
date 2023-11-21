import { Column, Entity, LeftJoin, PrimaryGenerateColumn } from '../../../../lib/httpservice'
import User from './user';
@Entity('words')
class Words {
    @PrimaryGenerateColumn({})
    public id: number;

    @Column({ filed: 'en_name', type: "varchar", length: 255 })
    public enName: string;

    @Column({ filed: 'own_mark', type: "varchar", length: 255 })
    public ownMark: string;

    @Column({ filed: 'user_id', type: "varchar", length: 255 })
    public userId: string;

    @Column({ type: "varchar", length: 255 })
    public updateTime: string;

    @Column({ type: "varchar", length: 255 })
    public createTime: string;

    @Column({ type: "varchar", length: 255 ,defaultValue(ctx){
        return 1
    }})
    public type: string;

    @LeftJoin(User,"words.user_id = users.id")
    public User:User;
}

export default Words;