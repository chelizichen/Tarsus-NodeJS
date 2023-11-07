import _ from "lodash";
import {pool} from "../database";

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");


interface ColumnType {
    filed?: string;
    type?: string;
    length?: number;
    defaultValue?:(ctx)=> string|number;
}

type whereCause = Record<string,any>

interface column_type {
    column_name: string;
    filed_name: string;
    filed_length: string | number;
    filed_type: string;
    table_name: string;
    defaultValue?:(ctx)=> string|number;
}

interface __column__ {
    [key: string]: column_type;
}
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
 * @param table 表名
 */
function Entity (table: string) {
    return function<T extends new (...args:any[])=>any>(
        proto: T,
        context: ClassDecoratorContext<T>
    ) {
        let knex;
        setImmediate(()=>{
            knex = pool
        })
        
        context.metadata.__table__ = table;    // 定义表
        context.metadata.__columns__ = [];       // 定义表的列
        context.metadata.__reference__ = [];       // 定义其他的引用 例如 leftJoin rightJoin join
        context.metadata.__primaryKey__ = {};       // 主键
        const target = class extends proto{
            constructor(...args:any[]){
                super(...args)
            }
            getList(pagination?: Pagination): Promise<any[]>;
            getList(options?: Record<string, any>, pagination?: Pagination): Promise<any[]>;
            getList(options?: Pagination | Record<string, any>, pagination?: Pagination): Promise<any[]>;
            getList(options?: unknown, pagination?: unknown): Promise<any[]> {
                const [table,key,fields] = this.useFields();
                if (options) {
                    // 单纯走分页
                    if (options instanceof Pagination) {
                        const offset:number = Number(options.page) * Number(options.size);
                        return knex.select(fields).limit(Number(options.size)).offset(offset)
                    }else{
                        return knex.select(fields).where(options).table(table)
                    }
                }else{
                    if (pagination instanceof Pagination || _.has(pagination,'size') || _.has(pagination,'page')) {
                        // @ts-ignore
                        const offset:number = Number(pagination.page) * Number(pagination.size).table(table);
                        // @ts-ignore
                        return knex.select(fields).where(options).limit(Number(pagination.size)).offset(offset).table(table)
                    }
                }
            }
            findOne(id: string | number): Promise<any> {
                const [table,key,fields] = this.useFields();
                return knex(table).where(key,id).select(fields);
            }
            delOne(id: string | number): Promise<any> {
                const [table,key,_] = this.useFields();
                return knex(table).where(key,id).del([key])
            }
            del(options: Record<string, string | number>): Promise<any> {
                const [table,key,_] = this.useFields();
                return knex(table).where(options).del([key])
            }

            async update(entity: any,where:whereCause): Promise<any> {
                const [table,key,fields] = this.useFields();
                const record = _.pick(entity,fields);
                return await knex(table).where(where).update(record,[key])
            }
            query(...args: any[]) {
                throw new Error("Method not implemented.");
            }

            // 需要进行一次转换
            save(entity: any): Promise<any> {
                const [table,key,fields,fieldsMap] = this.useFields();
                const record = {}
                _.map(fieldsMap,val=>{
                    record[val.field] = entity[val.column] || val.defaultValue(entity)
                })
                delete record[key];
                return knex(table).insert(record,[key])
            }

            private useFields():[string,string,string[],Array<{field:string;column:string;defaultValue:Function}>]{
                const key = (context.metadata.__primaryKey__ as column_type).filed_name as string;
                const fields = (context.metadata.__columns__ as column_type[]).map(item=>item.filed_name)
                const fieldsMap = (context.metadata.__columns__ as column_type[]).map(item=>({field:item.filed_name,column:item.column_name,defaultValue:item.defaultValue}))
                return [table,key,fields,fieldsMap]
            }
        }
        return target 
    };
};


const voidFn = () => null;
/**
 * @description 一般用于普通行
 * @Column({field:'id',length:255,type:'int'})
 * public id : number;
 */
function Column(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        setImmediate(()=>{
            const column_name = context.name;
            const filed_name = config.filed || _.snakeCase((context.name as string));
            const filed_length = config.length || "255";
            const filed_type = config.type || "varchar";
            const defaultValue = config.defaultValue || voidFn;
            const column = {column_name, filed_name, filed_length, filed_type, table_name: context.metadata.__table__,defaultValue};
            (context.metadata.__columns__ as any[]).push(column)
        })
    };
}

/**
 * @description 一般用于主键
 */
function PrimaryGenerateColumn(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        setImmediate(()=>{
            const column_name = context.name;
            const filed_name = config.filed || (context.name as string);
            const filed_length = config.length || "20";
            const filed_type = config.type || "bigint";
            const defaultValue = config.defaultValue || voidFn;
            const column = {column_name, filed_name, filed_length, filed_type, table_name: context.metadata.__table__,defaultValue};
            (context.metadata.__columns__ as any[]).push(column);
            context.metadata.__primaryKey__ = column;
        })
    };
}


function LeftJoin(table: string, cause: string) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const join = {
            joinTable: table,
            table: context.metadata.__table__,
            cause: cause,
            type: 'leftJoin'
        };
        (context.metadata.__reference__ as any[]).push(join);
    }
}

function Join(table: string, cause: string) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const join = {
            joinTable: table,
            table: context.metadata.__table__,
            cause: cause,
            type: 'Join'
        };
        (context.metadata.__reference__ as any[]).push(join);
    }
}

function RightJoin(table: string, cause: string) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const join = {
            joinTable: table,
            table: context.metadata.__table__,
            cause: cause,
            type: 'rightJoin'
        };
        (context.metadata.__reference__ as any[]).push(join);
    }
}

export {
    __column__,
    Entity,
    Column,
    PrimaryGenerateColumn,
    LeftJoin,
    Join,
    RightJoin,
    Repository,
    Pagination
};
