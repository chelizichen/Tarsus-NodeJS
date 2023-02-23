import { TarsusOrm } from "../../../decorator/web/orm";
import { Column, Entity } from "../../../decorator/web/orm/Entity";

@Entity("goods")
class Goods extends TarsusOrm {
  @Column
  id: string;

  @Column("sort_type_id")
  SortTypeId: string;

  @Column("goods_name")
  GoodsName: string;

  @Column("goods_price")
  GoodsPrice: string;

  @Column("goods_rest_num")
  GoodsRestNum: string;

  @Column("seller_id")
  SellerId: string;

  @Column("sort_child_id")
  SortChildId: string;
}

export {
    Goods
}