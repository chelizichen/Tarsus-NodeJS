import moment from "moment";
import { Controller, Get, TarsusError } from "../../../../lib/httpservice";
import { Repository } from "../../../../lib/httpservice";
import Words from "../entity/words";

@Controller('orm')
class OrmController{

    @Get("getList")
    async getList(){
        try{
            const words = new Words() as Repository<Words>
            words.ownMark = '1';
            words.enName = '1';
            words.userId = '1';
            words.createTime = moment().format("YYYY-MM-DD")
            words.updateTime = words.createTime;
            const ret = await words.save(words)
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