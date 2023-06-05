import { Pagination, Repo, Repository } from "../../../decorator/web/orm/Repo";
import { Service } from "../../../decorator/web/service/index";
import { FundList } from "../entity/goods.entity";

@Service
class AppService {
  // constructor() {}

  @Repo(FundList)
  private readonly FundList: Repository<FundList>;

  async hello() {
    const pagination = new Pagination(['1','10'])
    
    const onlyPagination = await this.FundList.getList(pagination)
    
    const allArgs = await this.FundList.getList({
      fundCode:"000001",
    },pagination)

    const data = await this.FundList.query(
      "select * from fund_list where id = ?",
      ["1"],
    );
    return {
      data,
      onlyPagination,
      allArgs
    };
  }
}

export { AppService };