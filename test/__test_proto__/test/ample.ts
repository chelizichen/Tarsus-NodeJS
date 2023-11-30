import { T_INT16, T_INT8, T_Map, T_String } from '../category';
import { DefineStruct, Override } from '../decorator'
import { T_WStream,T_RStream } from '../stream/index'

type Constructor<T> = new (...args:any[])=>T

type JceStruct = {
    Write:Constructor<T_WStream>,
    Read:Constructor<T_RStream>,
    _t_className:string;
}

const BasicInfo = {
    _t_className: "Struct<BasicInfo>",
} as JceStruct

BasicInfo.Write = @DefineStruct(BasicInfo._t_className) class extends T_WStream{

    @Override
    public Serialize(obj){
        this.WriteString    (0,obj.token);
        this.WriteMap       (1,obj.detail,T_String,T_String);
        return this;
    }
}

BasicInfo.Read = @DefineStruct(BasicInfo._t_className) class extends T_RStream{
    public token:T_String;
    public detail:T_Map

    @Override
    public Deserialize(){
        this.token  = this.ReadString(0)
        this.detail = this.ReadMap(1,T_String,T_String)
        return this
    }
}


const Pagination = {
    _t_className: "Struct<Pagination>",
} as JceStruct


Pagination.Write = @DefineStruct(Pagination._t_className) class extends T_WStream{

    @Override
    public Serialize(obj){
        this.WriteInt16     (0,obj.offset);
        this.WriteInt16     (1,obj.size);
        this.WriteString    (2,obj.keyword);
        return this;
    }
}

Pagination.Read = @DefineStruct(Pagination._t_className) class extends T_RStream{
    public offset:T_INT16;
    public size:T_INT16
    public keyword:T_String

    @Override
    public Deserialize(){
        this.offset  = this.ReadInt16(0)
        this.size = this.ReadInt16(1)
        this.keyword = this.ReadString(2)
        return this
    }
}

const User = {
    _t_className: "Struct<User>",
} as JceStruct

User.Write = @DefineStruct(User._t_className) class extends T_WStream{

    @Override
    public Serialize(obj){
        this.WriteInt8      (0,obj.id);
        this.WriteString    (1,obj.name);
        this.WriteInt8      (3,obj.age);
        this.WriteString    (4,obj.phone);
        this.WriteString    (5,obj.address);
        return this;
    }
}

User.Read = @DefineStruct(User._t_className) class extends T_RStream{
    public id:T_INT8;
    public name:T_String;
    public age:T_INT8;
    public phone:T_String;
    public address:T_String;

    @Override
    public Deserialize(){
        this.id = this.ReadInt8      (0);
        this.name = this.ReadString    (1,);
        this.age = this.ReadInt8      (3,);
        this.phone = this.ReadString    (4,);
        this.address = this.ReadString    (5,);
        return this
    }
}

const getUserListReq = {
    _t_className: "Struct<getUserListReq>",
} as JceStruct

getUserListReq.Write = @DefineStruct(getUserListReq._t_className) class extends T_WStream{
    @Override
    public Serialize(obj){
        debugger;
        this.WriteStruct(0,obj.basicInfo,BasicInfo.Write);
        this.WriteStruct(1,obj.page,    Pagination.Write);
        return this;
    }
}

getUserListReq.Read = @DefineStruct(getUserListReq._t_className) class extends T_RStream{
    public basicInfo : typeof BasicInfo.Read
    public page      : typeof Pagination.Read

    @Override
    public Deserialize(){
        this.basicInfo  = this.ReadStruct    (0,BasicInfo.Read);
        debugger;
        this.page       = this.ReadStruct    (1,Pagination.Read);
        return this
    }
}

function main(){
    const write_basicInfo = new BasicInfo.Write();
    const wbf = write_basicInfo.Serialize(
        {
            token:'1234',
            detail:{'a':'1','b':'2'}
        }
    ).toBuf()!;
    const read_basicInfo = new BasicInfo.Read(wbf).Deserialize().toObj()
    console.log(read_basicInfo);

    const write_pagination = new Pagination.Write();
    const wpg =  write_pagination.Serialize({
        offset:0,
        size:10,
        keyword:"hello world"
    }).toBuf()!;
    const read_pagination = new Pagination.Read(wpg).Deserialize().toObj()
    console.log(read_pagination);

    const write_user = new User.Write();
    const wus =  write_user.Serialize({
        id:0,
        name:'leemulus',
        age:12,
        phone:'12321412321',
        address:'wuhan'
    }).toBuf()!;
    const read_user = new User.Read(wus).Deserialize().toObj()
    console.log(read_user);
    

    const write_getuserreq = new getUserListReq.Write();
    const wgreq =  write_getuserreq.Serialize({
        basicInfo:{
            token:"qwe123asd123",
            detail:{
                a:"1",
                b:"2"
            }
        },
        page:{
            offset:0,
            size:10,
            keyword:"hello world"
        }
    }).toBuf()!;
    const rgreq = new getUserListReq.Read(wgreq).Deserialize().toObj()
    console.log(rgreq);
}

main();