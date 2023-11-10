import { Controller, Get, Pagination, Post, TarsusError } from "../../../../lib/httpservice";
import { Inject } from '../../../../lib/ioc'
import OrmService from "../service/OrmService";

@Controller('orm')
class OrmController{

    @Inject(OrmService) public OrmService:OrmService;

    @Get("getList")
    public async getList(){
        const data = await this.OrmService.getList();
        return data;
    }

    @Post("save")
    public async save(){
        try{
            const ret = await this.OrmService.save()
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