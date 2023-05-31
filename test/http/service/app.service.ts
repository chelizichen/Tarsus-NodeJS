import { Service } from "../../../decorator/web/service/index";
import { FundList } from "../entity/goods.entity";

@Service
class AppService {
  // @Inject(GoodsMapper) GoodsMapper: GoodsMapper;
  
  async hello() {
    // console.log(this.GoodsMapper);
    const data = await FundList.query(
      "select * from fund_list where id = ?", ["1"],
      FundList
    );

    // FundList.getL
    // await this.GoodsMapper.TestSelect([1,1]);
    return data;
  }
}

export { AppService };