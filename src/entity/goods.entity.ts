import { ArcOrm } from "../../decorator/web/orm";
import { Entity } from "../../decorator/web/orm/Entity";

@Entity("goods")
class Goods extends ArcOrm{
    
    id:string;
    
    sort_type_id:string;

    goods_name:string;

    goods_price:string;

    goods_rest_num:string;

    seller_id:string;

    sort_child_id:string;
    

}

export {
    Goods
}