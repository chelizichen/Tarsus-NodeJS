import { TarsusOrm } from "../../../decorator";
import { Column, Entity, PrimaryGenerateColumn } from "../../../decorator";

@Entity("fund_list")
class FundList{
  
  @PrimaryGenerateColumn({ filed: "id" })
  id: string;

  @Column({ filed: "fund_code" })
  fundCode: string;

  @Column({ filed: "fund_eng_name" })
  fundEngName: string;

  @Column({ filed: "fund_name" })
  fundName: string;

  @Column({ filed: "fund_type" })
  fundType: string;
}
export { FundList };
