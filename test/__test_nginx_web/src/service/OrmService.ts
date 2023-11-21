import moment from "moment";
import { Repository, TarsusError } from "../../../../lib/httpservice";
import { Collect, Inject } from "../../../../lib/ioc";
import Words from "../entity/words";
import { Transactional } from "../../../../lib/orm/Entity";

@Collect
class OrmService{
    
    @Inject(Words) public Words : Repository<Words>

    public async getList(){
        const data = await this.Words.getList();
        return data;
    }

    @Transactional()
    public async save(){
        try{
            const words = new Words() as Repository<Words>
            words.ownMark = '1';
            words.enName = '1';
            words.userId = '1';
            words.createTime = moment().format("YYYY-MM-DD")
            words.updateTime = words.createTime;
            const ret = await this.Words.save(words)
            return {
                code:0,
                ret
            }
        }catch(e){
            console.log(e);
            throw new TarsusError({code:-99,message:"error"})
        }
       
    }
}

export default OrmService