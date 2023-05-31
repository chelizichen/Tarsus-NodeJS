import { TarsusOrm } from "../../../decorator";
import { Column, Entity } from "../../../decorator/web/orm/Entity";

@Entity("fund_list")
class FundList  extends TarsusOrm{
  @Column({ filed: "id" })
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

// new Goods();

// Goods.query(
//   {
//     sql: "select * from goods",
//     args: [],
//   },
//   Goods
// ).then((res) => {
//   console.log(res);
// });
export { FundList };
