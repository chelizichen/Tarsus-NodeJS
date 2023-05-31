import { Service } from "../../../decorator/web/service/index";
import { FundList } from "../entity/goods.entity";

@Service
class AppService {
  // @Inject(GoodsMapper) GoodsMapper: GoodsMapper;
  
  async hello() {
    // console.log(this.GoodsMapper);
    const data = await FundList.query(
      {
        args: ["1"],
        sql: "select * from fund_list where id = ?",
      },
      FundList
    );
    // await this.GoodsMapper.TestSelect([1,1]);
    return data;
  }
}

export { AppService };