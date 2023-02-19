import { ArcOrm } from "../../../decorator/web/orm"
import { Mapper } from "../../../decorator/web/orm/Mapper"
import { Select } from "../../../decorator/web/orm/sql"


@Mapper
class GoodsMapper{
    
    @Select("select * from goods where id = ? and sort_child_id = ?")
    async TestSelect(args){
        const data = await ArcOrm.query(args)
        return data
    }
}

export{
    GoodsMapper
}