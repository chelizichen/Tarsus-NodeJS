import { ArcOrm } from "../../../decorator/web/orm"
import { Mapper } from "../../../decorator/web/orm/Mapper"
import { Select } from "../../../decorator/web/orm/sql"
import { Goods } from "../entity/goods.entity"


@Mapper
class GoodsMapper{
    
    @Select("select * from goods where id = ? and sort_child_id = ?")
    async TestSelect(args){
        const data = await ArcOrm.query(args,Goods)
        return data
    }
}

export{
    GoodsMapper
}