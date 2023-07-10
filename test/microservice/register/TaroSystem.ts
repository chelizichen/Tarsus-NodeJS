import os from 'os';
import { TarsusInterFace, TarsusMethod } from "../../../decorator";
import { Stream } from "../../../decorator/microservice/stream/Stream";
import { GetSystemLoadInfoReq, GetSystemLoadInfoRes } from "../struct/TaroSystem";

interface SystemInterFace {
    getLoadInfo(Request: GetSystemLoadInfoReq, Response: GetSystemLoadInfoRes): Promise<GetSystemLoadInfoRes>

}

@TarsusInterFace("SystemInterFace")
class TaroSystem implements SystemInterFace {

    @TarsusMethod
    @Stream("GetSystemLoadInfoReq", "GetSystemLoadInfoRes")
    async getLoadInfo(Request: GetSystemLoadInfoReq, Response: GetSystemLoadInfoRes): Promise<GetSystemLoadInfoRes> {
        console.log(Request.host);
        console.log(Request.time);
        console.log(Response);
        Response.data = String(os.loadavg()[0]);
        Response.isAlive = 1;
        return Response;
    }

}

export default TaroSystem