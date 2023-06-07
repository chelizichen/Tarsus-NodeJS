import {Column, Entity, OneToMany, PrimaryGenerateColumn} from "../../../decorator";
import {Keyword} from "../../../decorator/web/orm/Entity";

@Entity("trade_his")
class Tradehis {

    @PrimaryGenerateColumn({filed: "id"})
    id: string;

    @Column({filed: "fund_code"})
    fundCode: string;
    
    @Column({filed:"trade_date"})
    tradeDate:string;
    
    @Column({filed:"now_price"})
    nowPrice:string;
}

export {Tradehis};
