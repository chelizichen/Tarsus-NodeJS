import { isProxy } from "util/types";
import { TarsusEntitys } from "./Entity";

interface PaginationType{
  getOffset():string;
  keyword: string;
  size: string;
  page: string;
  // 分类字段
  sort:string;
  // desc | asc
  desc:string;
}

class Pagination implements PaginationType{
  sort: string = "";
  desc: string = "desc";
  keyword: string = "";
  size: string = "10";
  page: string = "1";

  constructor(limit?:Array<string>,keyword?:string,sort?:Array<string>){
    if(limit){
      [this.page,this.size] = limit;
    }
    this.keyword = keyword || this.keyword;
    if(sort){
      [this.sort,this.desc] = sort
    }
  }

  getOffset(){
    return String(Number(this.size) * (Number(this.page) - 1))
  }
}


/**
 * @description 提供对应ORM方法
 */
declare interface OrmMethods<T> {
  /**
   * 获得指定列表
   * @param pagination 
   */
  getList(pagination?: Pagination): Promise<Array<T>>;
  /**
   * @method 通过指定项获得对应的列表
   */
  getList(options?:Record<string,any>,pagination?:Pagination): Promise<Array<T>>
  /**
   * @method 查询指定行
   * @param options
   * @param pagination
   */
  getList(options?:Record<string,any> | Pagination,pagination?:Pagination): Promise<Array<T>>
  /**
   * @method 查询指定行
   * @param id 
   */

  findOne(id:string|number):  Promise<T>;
  /**
   * @method 删除指定行
   * @param id 
   */
  delOne(id:string|number): Promise<any>;
  del(options:Record<string, string|number>):Promise<any>;
  /**
   * @method 保存
   * @param entity 
   */
  save(entity: T): void;
  /**
   * @method 更新
   * @param entity 
   */
  update(entity: T): void;
  /**
   * @method 查询
   * @param args 
   */
  query(...args: any[]): any;
}

type Repository<T> = OrmMethods<T> & T;

/**
 * @description 对ORM 做代理增添属性
 */
function TarsusOrmProxy(target) {
  // 
  const OrmMethods = target.__ormMethods__
  const methods = Object.getOwnPropertyNames(
    Object.getPrototypeOf(OrmMethods)
  ).filter((name) => typeof OrmMethods[name] === "function"  && name!="constructor");
  
  for (let v of methods) {
    target[v] = new Proxy(OrmMethods[v], {
      'apply': function (target,thisArg,args) {
        return Reflect.apply(target,thisArg,args)
      }
    });
    delete OrmMethods[v]
  }
  return target
}

function Repo(Entity: new (...args: any[]) => any) {
  return function (value: any, context: ClassFieldDecoratorContext) {
    return function () {
      const targetEntity = TarsusOrmProxy(TarsusEntitys[Entity.prototype]);
      console.log("__reference__",TarsusEntitys[Entity.prototype]);
      
      return targetEntity;
    };
  };
}

export { Repository, Repo,OrmMethods,Pagination };
