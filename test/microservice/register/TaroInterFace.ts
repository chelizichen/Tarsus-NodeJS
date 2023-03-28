import { TarsusInterFace, TarsusMethod } from "../../../decorator";
import { Stream } from "../../../decorator/microservice/stream/Stream";
import {
  GetUserByIdReq,
  GetUserByIdRes,
  GetUserListReq,
  GetUserListRes,
} from "../struct/TaroUser";

interface TaroInterFace {
  getUserById(
    Request: GetUserByIdReq,
    Response: GetUserByIdRes
  ): Promise<GetUserByIdRes>;
  getUserList(
    Request: GetUserListReq,
    Response: GetUserListRes
  ): Promise<GetUserListRes>;
}

@TarsusInterFace("TaroInterFaceTest")
class TaroInterFaceImpl implements TaroInterFace {
  @TarsusMethod
  @Stream("GetUserByIdReq", "GetUserByIdRes")
  getUserById(
    Request: GetUserByIdReq,
    Response: GetUserByIdRes
  ): Promise<GetUserByIdRes> {
    return new Promise((resolve, reject) => {
      Response.code = 0;
      Response.data = {
        address: "1",
        age: "11",
        id: "11",
        fullName: "11",
        name: "11",
      };
      Response.message = Request.basic.token;
      resolve(Response);
    });
  }

  @TarsusMethod
  @Stream("GetUserListReq", "GetUserListRes")
  getUserList(
    Request: GetUserListReq,
    Response: GetUserListRes
  ): Promise<GetUserListRes> {
    throw new Error("Method not implemented.");
  }
}

export default TaroInterFaceImpl;
