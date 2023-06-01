import { Repo, Repository } from "../../../decorator/web/orm/Repo";
import { Service } from "../../../decorator/web/service/index";
import { FundList } from "../entity/goods.entity";

@Service
class AppService {
  // constructor() {}

  @Repo(FundList)
  private readonly FundList: Repository<FundList>;

  async hello() {
    console.log("fundList", this.FundList.getList());
    const data = await this.FundList.query(
      "select * from fund_list where id = ?",
      ["1"],
      FundList
    );

    // FundList.getL
    // await this.GoodsMapper.TestSelect([1,1]);
    return data;
  }
}

export { AppService };