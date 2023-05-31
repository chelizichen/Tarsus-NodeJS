import { Service } from "../../../decorator/web/service";
import { Inject } from "../../../decorator/ioc";
import { GoodsMapper } from "../mapper/goods.mapper";
@Service
class TestService {

  @Inject(GoodsMapper) GoodsMapper:GoodsMapper;
  
  async hello(id:string) {
    const data = await this.GoodsMapper.TestSelect([id])
    return data
  }
}

export { TestService };
