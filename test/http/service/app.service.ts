import { Pagination, Repo, Repository } from "../../../decorator/web/orm/Repo";
import { Service } from "../../../decorator";
import { Fund } from "../entity/fund";
import _ from 'lodash'
import { isProxy } from "util/types";
@Service
class AppService {
  // constructor() {}

  @Repo(Fund)  private readonly Fund: Repository<Fund>;

  async hello() {    
    const pagination = new Pagination(["1", "1000000"]);
    // getList
    // debugger;

    // console.log("this.Fund.getList", this.Fund.getList);
    const onlyPagination = await this.Fund.getList(pagination);
    // const groupedByFundCode = _.groupBy(onlyPagination, "fundCode");
    // const transformedObject = [];

    // _.forEach(groupedByFundCode, (group, fundCode) => {
    //   let obj: Record<string, any> = {};
    //   const firstItem = _.head(group);
    //   const tradeList = _.map(group, (item) =>
    //     _.pick(item, [
    //       "tradeList.id",
    //       "tradeList.fundCode",
    //       "tradeList.date",
    //       "tradeList.fundWorth",
    //       "tradeList.fundTotalWorth",
    //       "tradeList.fundChange",
    //     ])
    //   );

    //   obj = _.pick(firstItem, [
    //     "id",
    //     "fundCode",
    //     "fundEngName",
    //     "fundName",
    //     "fundType",
    //   ]);
    //   obj.tradeList = tradeList;
    //   transformedObject.push(obj);
    // });
    // const allArgs = await this.Fund.getList({
    //   fundCode:"000001",
    // },pagination)

    // const delOne = await this.Fund.delOne("1")

    // const data = await this.Fund.query(
    //   "select * from fund_list where id = ?",
    //   ["1"],
    // );
    return {
      // data,
      // onlyPagination: transformedObject,
      onlyPagination: onlyPagination,
      // allArgs,
      // delOne
    };
  }
}

export { AppService };