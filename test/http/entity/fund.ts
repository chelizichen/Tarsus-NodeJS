import {Column, Entity, JoinColumn, OneToMany, PrimaryGenerateColumn} from "../../../decorator";
import { Keyword } from "../../../decorator/web/orm/Entity";
import {Tradehis} from "./trade";

@Entity("fund_list")
class Fund{
  
  @PrimaryGenerateColumn({ filed: "id" })
  id: string;

  @Column({ filed: "fund_code" })
  fundCode: string;

  @Column({ filed: "fund_eng_name" })
  fundEngName: string;

  @Column({ filed: "fund_name" })
  @Keyword()
  fundName: string;

  @Column({ filed: "fund_type" })
  fundType: string;

  /**
  两个表使用哪个字段进行关联
  */
  @OneToMany(Tradehis,"fund_code")
  @JoinColumn("fund_code")
  tradeList:Tradehis[]
}
export { Fund };
