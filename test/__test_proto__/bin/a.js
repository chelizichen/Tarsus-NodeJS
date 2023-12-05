const text = `
include Sertest;

module Ample;
struct QueryId      {
    0   int8    id;
    1   BasicInfo basicInfo;
}

struct BasicInfo    {
    0   string  token;
    1   map<string,string>  detail;
}

struct Pagination   {
    0   int16    offset;
    1   int16    size;
    2   string   keyword;
}

struct User   {
    0   int8    id;
    1   string  name;
    2   int8    age;
    3   string  phone;
    4   string  address;  
}

struct getUserListReq  {
    0   BasicInfo     basicInfo;
    1   Pagination    page;
}

struct getUserListRes  {
    0   int8    code;
    1   string  message;
    2   vector<User>  data;
    3   User    user;
}

struct getUserRes  {
    0   int8    code;
    1   string  message;
    2   User    data;
}

rpc getUserList (getUserListReq req, getUserListRes res);  
rpc getUser     (QueryId req, getUserRes res);

`;  
  
// 使用正则表达式匹配方法名和参数请求  
const regex = /rpc\s+(\w+)\s*\(([^()]+)\)\s*;+/g;  
const matches = text.match(regex);  
  
// 解析匹配结果并构建对象数组  
const rpcMethods = matches.map(match => {  
    const [rpcName, argRequest] = match.split(/\s*\(([^()]+)\)\s*/);  
    const [, req, reqName, res, resName] = argRequest.match(/(\w+)\s+(\w+),\s*(\w+)\s+(\w+)/);

    return { rpcName, req,reqName,res,resName };  
});  
  
console.log(rpcMethods);
