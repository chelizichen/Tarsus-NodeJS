import { Pagination, Repo, Repository } from "../../../decorator/web/orm/Repo";
import { Service } from "../../../decorator";
import { Fund } from "../entity/fund";

@Service
class AppService {
  // constructor() {}

  @Repo(Fund)
  private readonly Fund: Repository<Fund>;

  async hello() {
    const pagination = new Pagination(['1','10'])
    
    const onlyPagination = await this.Fund.getList(pagination)
    const allArgs = await this.Fund.getList({
      fundCode:"000001",
    },pagination)

    const delOne = await this.Fund.delOne("1")

    const data = await this.Fund.query(
      "select * from fund_list where id = ?",
      ["1"],
    );
    return {
      data,
      onlyPagination,
      allArgs,
      delOne
    };
  }
}

export { AppService };