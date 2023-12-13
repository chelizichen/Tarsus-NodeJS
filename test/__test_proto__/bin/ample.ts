// include Sample;
// module Ample;
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
import { JceStruct, ClinetProxy, Module } from "../type";
import Sample from "./Sample";

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");
const Ample: Module = {};

Ample.Sample = Sample as Record<string, JceStruct>;

const QueryId = {
  _t_className: "Ample.Struct<QueryId>",
} as JceStruct;

T_Container.Set(QueryId);

Ample.QueryId = QueryId;

QueryId.Read =
  @DefineStruct(QueryId._t_className)
  class extends T_RStream {
    @DefineField(0) public id;
    @DefineField(1) public basicInfo;

    @Override public Deserialize() {
      this.id = this.ReadInt8(0);
      this.basicInfo = this.ReadStruct(1, BasicInfo.Read);
      return this;
    }
  };

QueryId.Write =
  @DefineStruct(QueryId._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt8(0, T_Utils.Read2Number(obj, "id"));
      this.WriteStruct(
        1,
        T_Utils.Read2Object(obj, "basicInfo"),
        BasicInfo.Write,
      );
      return this;
    }
  };

const BasicInfo = {
  _t_className: "Ample.Struct<BasicInfo>",
} as JceStruct;

T_Container.Set(BasicInfo);

Ample.BasicInfo = BasicInfo;

BasicInfo.Read =
  @DefineStruct(BasicInfo._t_className)
  class extends T_RStream {
    @DefineField(0) public token;
    @DefineField(1) public detail;

    @Override public Deserialize() {
      this.token = this.ReadString(0);
      this.detail = this.ReadMap(1, T_String, T_String);
      return this;
    }
  };

BasicInfo.Write =
  @DefineStruct(BasicInfo._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteString(0, T_Utils.Read2String(obj, "token"));
      this.WriteMap(1, T_Utils.Read2Object(obj, "detail"), T_String, T_String);
      return this;
    }
  };

const Pagination = {
  _t_className: "Ample.Struct<Pagination>",
} as JceStruct;

T_Container.Set(Pagination);

Ample.Pagination = Pagination;

Pagination.Read =
  @DefineStruct(Pagination._t_className)
  class extends T_RStream {
    @DefineField(0) public offset;
    @DefineField(1) public size;
    @DefineField(2) public keyword;

    @Override public Deserialize() {
      this.offset = this.ReadInt16(0);
      this.size = this.ReadInt16(1);
      this.keyword = this.ReadString(2);
      return this;
    }
  };

Pagination.Write =
  @DefineStruct(Pagination._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt16(0, T_Utils.Read2Number(obj, "offset"));
      this.WriteInt16(1, T_Utils.Read2Number(obj, "size"));
      this.WriteString(2, T_Utils.Read2String(obj, "keyword"));
      return this;
    }
  };

const User = {
  _t_className: "Ample.Struct<User>",
} as JceStruct;

T_Container.Set(User);

Ample.User = User;

User.Read =
  @DefineStruct(User._t_className)
  class extends T_RStream {
    @DefineField(0) public id;
    @DefineField(1) public name;
    @DefineField(2) public age;
    @DefineField(3) public phone;
    @DefineField(4) public address;
    @DefineField(5) public status;

    @Override public Deserialize() {
      this.id = this.ReadInt8(0);
      this.name = this.ReadString(1);
      this.age = this.ReadInt8(2);
      this.phone = this.ReadString(3);
      this.address = this.ReadString(4);
      this.status = this.ReadInt8(5);
      return this;
    }
  };

User.Write =
  @DefineStruct(User._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt8(0, T_Utils.Read2Number(obj, "id"));
      this.WriteString(1, T_Utils.Read2String(obj, "name"));
      this.WriteInt8(2, T_Utils.Read2Number(obj, "age"));
      this.WriteString(3, T_Utils.Read2String(obj, "phone"));
      this.WriteString(4, T_Utils.Read2String(obj, "address"));
      this.WriteInt8(5, T_Utils.Read2Number(obj, "status"));
      return this;
    }
  };

const getUserListReq = {
  _t_className: "Ample.Struct<getUserListReq>",
} as JceStruct;

T_Container.Set(getUserListReq);

Ample.getUserListReq = getUserListReq;

getUserListReq.Read =
  @DefineStruct(getUserListReq._t_className)
  class extends T_RStream {
    @DefineField(0) public basicInfo;
    @DefineField(1) public page;

    @Override public Deserialize() {
      this.basicInfo = this.ReadStruct(0, BasicInfo.Read);
      this.page = this.ReadStruct(1, Pagination.Read);
      return this;
    }
  };

getUserListReq.Write =
  @DefineStruct(getUserListReq._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteStruct(
        0,
        T_Utils.Read2Object(obj, "basicInfo"),
        BasicInfo.Write,
      );
      this.WriteStruct(1, T_Utils.Read2Object(obj, "page"), Pagination.Write);
      return this;
    }
  };

const getUserListRes = {
  _t_className: "Ample.Struct<getUserListRes>",
} as JceStruct;

T_Container.Set(getUserListRes);

Ample.getUserListRes = getUserListRes;

getUserListRes.Read =
  @DefineStruct(getUserListRes._t_className)
  class extends T_RStream {
    @DefineField(0) public code;
    @DefineField(1) public message;
    @DefineField(2) public data;
    @DefineField(3) public user;

    @Override public Deserialize() {
      this.code = this.ReadInt8(0);
      this.message = this.ReadString(1);
      this.data = this.ReadVector(2, User.Read);
      this.user = this.ReadStruct(3, User.Read);
      return this;
    }
  };

getUserListRes.Write =
  @DefineStruct(getUserListRes._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt8(0, T_Utils.Read2Number(obj, "code"));
      this.WriteString(1, T_Utils.Read2String(obj, "message"));
      this.WriteVector(2, T_Utils.Read2Vector(obj, "data"), User.Write);
      this.WriteStruct(3, T_Utils.Read2Object(obj, "user"), User.Write);
      return this;
    }
  };

const getUserRes = {
  _t_className: "Ample.Struct<getUserRes>",
} as JceStruct;

T_Container.Set(getUserRes);

Ample.getUserRes = getUserRes;

getUserRes.Read =
  @DefineStruct(getUserRes._t_className)
  class extends T_RStream {
    @DefineField(0) public code;
    @DefineField(1) public message;
    @DefineField(2) public data;

    @Override public Deserialize() {
      this.code = this.ReadInt8(0);
      this.message = this.ReadString(1);
      this.data = this.ReadStruct(2, User.Read);
      return this;
    }
  };

getUserRes.Write =
  @DefineStruct(getUserRes._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt8(0, T_Utils.Read2Number(obj, "code"));
      this.WriteString(1, T_Utils.Read2String(obj, "message"));
      this.WriteStruct(2, T_Utils.Read2Object(obj, "data"), User.Write);
      return this;
    }
  };

export const LoadAmpleProxy = function (client: ClinetProxy) {
  this.client = client;
  this.module = "Ample";
  T_Utils.HideProperties(this); // HideProperties
  this.getUserList = LoadAmpleProxy.prototype.getUserList.bind(this);
  this.getUser = LoadAmpleProxy.prototype.getUser.bind(this);
  this.setUser = LoadAmpleProxy.prototype.setUser.bind(this);
};

LoadAmpleProxy.module = "Ample";

LoadAmpleProxy.prototype.getUserList = function (data) {
  return new Promise((resolve) => {
    (this.client as ClinetProxy)
      .$InvokeRpc(
        this.module,
        "getUserList",
        Ample.getUserListReq._t_className as string,
        data,
      )
      .then((resp) => {
        resolve(resp);
      });
  });
};

LoadAmpleProxy.prototype.getUser = function (data) {
  return new Promise((resolve) => {
    (this.client as ClinetProxy)
      .$InvokeRpc(
        this.module,
        "getUser",
        Ample.QueryId._t_className as string,
        data,
      )
      .then((resp) => {
        resolve(resp);
      });
  });
};

LoadAmpleProxy.prototype.setUser = function (data) {
  return new Promise((resolve) => {
    (this.client as ClinetProxy)
      .$InvokeRpc(
        this.module,
        "setUser",
        Ample.User._t_className as string,
        data,
      )
      .then((resp) => {
        resolve(resp);
      });
  });
};

export const LoadAmpleServer = function (server) {
  this.server = server;
  this.module = "Ample";
  this.TarsInitialize();
};

LoadAmpleServer.prototype.TarsInitialize = function () {
  T_Container.SetMethod(
    this.module,
    "getUserList",
    this.getUserList.bind(this),
  );
  T_Container.SetRpcMethod(
    "getUserList",
    (Ample as any).getUserListReq._t_className as string,
    (Ample as any).getUserListRes._t_className as string,
  );

  T_Container.SetMethod(this.module, "getUser", this.getUser.bind(this));
  T_Container.SetRpcMethod(
    "getUser",
    (Ample as any).QueryId._t_className as string,
    (Ample as any).getUserRes._t_className as string,
  );

  T_Container.SetMethod(this.module, "setUser", this.setUser.bind(this));
  T_Container.SetRpcMethod(
    "setUser",
    (Ample as any).User._t_className as string,
    (Ample as any).Sample.BasicResp._t_className as string,
  );
};

LoadAmpleServer.prototype.getUserList = async function (ctx, req) {
  throw new Error("Module Method has not implyment");
};

LoadAmpleServer.prototype.getUser = async function (ctx, req) {
  throw new Error("Module Method has not implyment");
};

LoadAmpleServer.prototype.setUser = async function (ctx, req) {
  throw new Error("Module Method has not implyment");
};

export default Ample;
