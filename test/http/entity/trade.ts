import {Column, Entity, OneToMany, PrimaryGenerateColumn} from "../../../decorator";
import {Keyword} from "../../../decorator/web/orm/Entity";

@Entity("fund_his")
class Tradehis {

    @PrimaryGenerateColumn({filed: "id"})
    id: string;

    @Column({filed: "fund_code"})
    fundCode: string;
    
    @Column({filed:"date"})
    date:Date;
    
    @Column({filed:"fund_worth"})
    fundWorth:string;

    @Column({filed:"fund_total_worth"})
    fundTotalWorth:string;

    @Column({filed:"fund_change"})
    fundChange:string;
}

export {Tradehis};
