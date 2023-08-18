import {
    GetUserByIdReq,
    GetUserByIdRes,
    GetUserListReq,
    GetUserListRes,
    User,
} from "../struct/TaroUser";
import {Stream, TarsusInterFace, TarsusMethod} from "../../../../lib/decorator/ms/interface";

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
        return new Promise((resolve, reject) => {
            Response.code = 0;
            Response.data = Request.ids.map(el => {
                let user = new User()
                user.address = el + "address";
                user.id = el + "id";
                user.fullName = el + "fullName";
                user.name = el + "name";
                user.age = el + "age";
                return user;
            })
            Response.message = Request.basic.token;
            resolve(Response);
        });
    }
}

export default TaroInterFaceImpl;
