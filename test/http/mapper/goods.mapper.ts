import { TarsusOrm } from "../../../decorator/web/orm"
import { Mapper } from "../../../decorator/web/orm/Mapper"
import { Select } from "../../../decorator/web/orm/sql"
import { FundList } from "../entity/goods.entity";


@Mapper
class GoodsMapper{
    
    @Select("select * from fund_list where id = ?")
    async TestSelect(args){
        const data = await TarsusOrm.query(args, FundList);
        return data;
    }
}

export{
    GoodsMapper
}