// include Sertest;
// module Sample;
import {
  T_Container,
  T_INT16,
  T_INT8,
  T_Map,
  T_String,
  T_Vector,
  T_Utils,
} from "../category";
import { DefineField, DefineStruct, Override } from "../decorator";
import { T_WStream, T_RStream } from "../stream/index";
import { JceStruct, ClinetProxy } from "../type";

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");
const Sample: Record<string, JceStruct> = {};

const QueryId = {
  _t_className: "Struct<QueryId>",
} as JceStruct;

T_Container.Set(QueryId);

Sample.QueryId = QueryId;

QueryId.Read =
  @DefineStruct(QueryId._t_className)
  class extends T_RStream {
    @DefineField(0) public id;
    @DefineField(1) public basicInfo;

    @Override public Deserialize() {
      this.id = this.ReadInt32(0);
      this.basicInfo = this.ReadStruct(1, BasicInfo.Read);
      return this;
    }
  };

QueryId.Write =
  @DefineStruct(QueryId._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt32(0, T_Utils.Read2Number(obj, "id"));
      this.WriteStruct(
        1,
        T_Utils.Read2Object(obj, "basicInfo"),
        BasicInfo.Write,
      );
      return this;
    }
  };

const BasicInfo = {
  _t_className: "Struct<BasicInfo>",
} as JceStruct;

T_Container.Set(BasicInfo);

Sample.BasicInfo = BasicInfo;

BasicInfo.Read =
  @DefineStruct(BasicInfo._t_className)
  class extends T_RStream {
    @DefineField(0) public token;
    @DefineField(1) public traceId;

    @Override public Deserialize() {
      this.token = this.ReadString(0);
      this.traceId = this.ReadInt32(1);
      return this;
    }
  };

BasicInfo.Write =
  @DefineStruct(BasicInfo._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteString(0, T_Utils.Read2String(obj, "token"));
      this.WriteInt32(1, T_Utils.Read2Number(obj, "traceId"));
      return this;
    }
  };

const User = {
  _t_className: "Struct<User>",
} as JceStruct;

T_Container.Set(User);

Sample.User = User;

User.Read =
  @DefineStruct(User._t_className)
  class extends T_RStream {
    @DefineField(0) public userId;
    @DefineField(1) public userName;
    @DefineField(2) public phoneNumber;
    @DefineField(3) public userAddress;
    @DefineField(4) public createTime;
    @DefineField(5) public status;

    @Override public Deserialize() {
      this.userId = this.ReadInt32(0);
      this.userName = this.ReadString(1);
      this.phoneNumber = this.ReadString(2);
      this.userAddress = this.ReadString(3);
      this.createTime = this.ReadString(4);
      this.status = this.ReadInt8(5);
      return this;
    }
  };

User.Write =
  @DefineStruct(User._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt32(0, T_Utils.Read2Number(obj, "userId"));
      this.WriteString(1, T_Utils.Read2String(obj, "userName"));
      this.WriteString(2, T_Utils.Read2String(obj, "phoneNumber"));
      this.WriteString(3, T_Utils.Read2String(obj, "userAddress"));
      this.WriteString(4, T_Utils.Read2String(obj, "createTime"));
      this.WriteInt8(5, T_Utils.Read2Number(obj, "status"));
      return this;
    }
  };

export const LoadSampleProxy = function (client: ClinetProxy) {
  this.client = client;
  this.module = "Sample";
};

LoadSampleProxy.prototype.getUserById = function (data) {
  return new Promise((resolve) => {
    (this.client as ClinetProxy)
      .$InvokeRpc(this.module, "getUserById", Sample.QueryId._t_className, data)
      .then((resp) => {
        resolve(resp);
      });
  });
};

export const LoadSampleServer = function (server) {
  this.server = server;
  this.module = "Sample";
  this.TarsInitialize();
};

LoadSampleServer.prototype.TarsInitialize = function () {
  T_Container.SetMethod(
    this.module,
    "getUserById",
    this.getUserById.bind(this),
  );
  T_Container.SetRpcMethod(
    "getUserById",
    Sample.QueryId._t_className,
    Sample.User._t_className,
  );
};

LoadSampleServer.prototype.getUserById = async function (ctx, req) {
  throw new Error("Module Method has not implyment");
};

export default Sample;
