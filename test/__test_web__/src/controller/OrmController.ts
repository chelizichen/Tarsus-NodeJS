import moment from "moment";
import { Controller, Get, Pagination, Post, TarsusError } from "../../../../lib/httpservice";
import { Inject } from '../../../../lib/ioc'
import { Repository } from "../../../../lib/httpservice";
import Words from "../entity/words";

@Controller('orm')
class OrmController{

    @Inject(Words)
    public Words : Repository<Words>

    @Get("getList")
    public async getList(){
        const data = await this.Words.getList();
        return data;
    }

    @Post("save")
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

export default OrmController