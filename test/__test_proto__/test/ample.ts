import { T_Container, T_INT16, T_INT8, T_Map, T_String, T_Vector } from '../category';
import { DefineField, DefineStruct, Override } from '../decorator'
import { T_WStream,T_RStream } from '../stream/index'
import { JceStruct } from '../type';

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");


const BasicInfo = {
    _t_className: "Struct<BasicInfo>",
} as JceStruct
T_Container.Set(BasicInfo)

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
T_Container.Set(Pagination)


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
T_Container.Set(User)

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
    @DefineField(0) public id:T_INT8;
    @DefineField(1) public name:T_String;
    @DefineField(2) public age:T_INT8;
    @DefineField(3) public phone:T_String;
    @DefineField(4) public address:T_String;

    @Override
    public Deserialize(){
        this.id = this.ReadInt8      (0);
        this.name = this.ReadString    (1,);
        this.age = this.ReadInt8      (2,);
        this.phone = this.ReadString    (3,);
        this.address = this.ReadString    (4,);
        return this
    }
}

const getUserListReq = {
    _t_className: "Struct<getUserListReq>",
} as JceStruct
T_Container.Set(getUserListReq)

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
        this.page       = this.ReadStruct    (1,Pagination.Read);
        return this
    }
}

const getUserListRes = {
    _t_className: "Struct<getUserListRes>",
} as JceStruct
T_Container.Set(getUserListRes)

getUserListRes.Write = @DefineStruct(getUserListRes._t_className) class extends T_WStream{
    @Override
    public Serialize(obj){
        this.WriteInt8  (0,obj.code);
        this.WriteString(1,obj.message);
        this.WriteVector(2,obj.data,User.Write);
        this.WriteStruct(3,obj.user,User.Write);
        return this;
    }
}

getUserListRes.Read = @DefineStruct(getUserListRes._t_className) class extends T_RStream{
    
    @DefineField(0) public code     : T_INT8
    @DefineField(1) public message  : T_String
    @DefineField(2) public data     : T_Vector<typeof User.Read>
    @DefineField(3) public user     : typeof User.Read
    @Override public Deserialize(){
        this.code       = this.ReadInt8    (0);
        this.message    = this.ReadString  (1);
        this.data       = this.ReadVector  (2,User.Read);
        this.user       = this.ReadStruct  (3,User.Read);
        return this
    }
}

function main(){
    // const write_basicInfo = new BasicInfo.Write();
    // const wbf = write_basicInfo.Serialize(
    //     {
    //         token:'1234',
    //         detail:{'a':'1','b':'2'}
    //     }
    // ).toBuf()!;
    // const read_basicInfo = new BasicInfo.Read(wbf).Deserialize().toObj()
    // console.log(read_basicInfo);

    // const write_pagination = new Pagination.Write();
    // const wpg =  write_pagination.Serialize({
    //     offset:0,
    //     size:10,
    //     keyword:"hello world"
    // }).toBuf()!;
    // const read_pagination = new Pagination.Read(wpg).Deserialize().toObj()
    // console.log(read_pagination);

    // const write_user = new User.Write();
    // const wus =  write_user.Serialize({
    //     id:0,
    //     name:'leemulus',
    //     age:12,
    //     phone:'12321412321',
    //     address:'wuhan'
    // }).toBuf()!;
    // const read_user = new User.Read(wus).Deserialize().toObj()
    // console.log(read_user);
    

    // const write_getuserreq = new getUserListReq.Write();
    // const wgreq =  write_getuserreq.Serialize({
    //     basicInfo:{
    //         token:"qwe123asd123",
    //         detail:{
    //             a:"1",
    //             b:"2"
    //         }
    //     },
    //     page:{
    //         offset:0,
    //         size:10,
    //         keyword:"hello world"
    //     }
    // }).toBuf()!;
    // const rgreq = new getUserListReq.Read(wgreq).Deserialize().toObj()
    // console.log(rgreq);

    const write_getuserres = new getUserListRes.Write();
    debugger;
    const wgres =  write_getuserres.Serialize({
        code:0,
        message:'ok',
        data:[
            {
                id:0,
                name:'leemulus',
                age:13,
                phone:'12321412321',
                address:'wuhan'
            },
            {
                id:1,
                name:'leemulus',
                age:14,
                phone:'12321412321',
                address:'wuhan'
            },
            {
                id:2,
                name:'leemulus',
                age:15,
                phone:'12321412321',
                address:'wuhan'
            }
        ],
        user: {
            id:0,
            name:'leemulus',
            age:13,
            phone:'12321412321',
            address:'wuhan'
        },
        
    }).toBuf()!;
    debugger;
    const rgres = new getUserListRes.Read(wgres).Deserialize().toObj()
    console.log(rgres);
}

main();