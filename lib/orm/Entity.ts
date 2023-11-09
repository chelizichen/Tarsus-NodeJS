import _ from "lodash";
import { pool } from "../database";
import { DecoratorError } from "../decorator/http/error";
import knex, { Knex } from "knex";
import { IocContainer } from "../decorator/ioc";

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
    field_name: string;
    field_length: string | number;
    field_type: string;
    table_name: string;
    referenceColumn?: string; // leftjoin 时使用
    origin_field_name?:string;
    defaultValue?:(ctx)=> string|number;
}

interface __column__ {
    [key: string]: column_type;
}
interface PaginationType{
    getOffset(): number;
    size:  number;
    page:  number;
  }
  
function isMatchingKey(key,pre) {
    return key.startsWith(pre);
}

function transformKey(key,pre,table) {
    return key.replace(pre, '').replace(`${table}.`, '');
}

function convertToNested(originalObject:Record<string,any>, ctx:string, table:string,c2f:Record<string,string>) {
    const pre = `ormPre__${ctx}__`;

    const nestedUserObject = _.transform(originalObject, (result:Record<string,any>, value:string, key:string) => {
        if (isMatchingKey(key,pre)) {
            let nestedKey = transformKey(key,pre,table);
            const { [ctx]: nestedContext = {} } = result;
            nestedKey = c2f[nestedKey]
            result[ctx] = { ...nestedContext, [nestedKey]: value };
        } else {
            result[key] = value;
        }
    }, {});

    return nestedUserObject;
}


class Pagination implements PaginationType{
    public size:    number  = 10;
    public page:    number  = 1;

    constructor(page:|number,size:|number){
        this.page = page;
        this.size = size;
    }

    getOffset(){
        return this.size * (this.page - 1)
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

    find(condition:Record<string,any>):  Promise<Array<T>>;
    findOne(condition:Record<string,any>):  Promise<T>;
    findOneById(id:string | number): Promise<T>;
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
    update(entity: T,whereCause:whereCause): Promise<any>;
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
        let knex :Knex;
        setImmediate(()=>{
            knex = pool
            context.metadata.__knex__ = pool;
        })
        context.metadata.__table__ = table;    // 定义表
        context.metadata.__columns__ = [];       // 定义表的列
        context.metadata.__reference__ = STFn;       // 定义其他的引用 例如 leftJoin rightJoin join
        context.metadata.__primaryKey__ = {};       // 主键
        context.metadata.__isEntity__ = true;   // 声明为实体
        context.metadata.__columnMap2field__ = {};   // 映射
        const target = class extends proto implements OrmMethods<any>{
            constructor(...args:any[]){
                super(...args)
            }
            async getList(pagination?: Pagination): Promise<any[]>;
            async getList(options?: Record<string, any>, pagination?: Pagination): Promise<any[]>;
            async getList(options?: Pagination | Record<string, any>, pagination?: Pagination): Promise<any[]>;
            async getList(options?: unknown, pagination?: unknown): Promise<any[]> {
                // debugger;
                const [table,key,fields] = this.useFields();
                const reference = context.metadata.__reference__ as Function;
                let data:any[] = [];
                if (options) {
                    // 单纯走分页
                    if (options instanceof Pagination) {
                        const offset:number = Number(options.page) * Number(options.size);
                        data = await reference(knex.select(fields).limit(Number(options.size)).offset(offset));
                    }else{
                        data = await reference(knex.select(fields).where(options).table(table))
                    }
                }else{
                    if (pagination instanceof Pagination || _.has(pagination,'size') || _.has(pagination,'page')) {
                        // @ts-ignore
                        const offset:number = Number(pagination.page - 1) * Number(pagination.size).table(table);
                        // @ts-ignore
                        data = await reference(knex.select(fields).where(options).limit(Number(pagination.size)).offset(offset).table(table))
                    }else{
                        data = await reference(knex.select(fields).table(table))
                    }
                }
                return this.setData2Column(data);
            }
            async findOne(condition:Record<string,any>): Promise<any> {
                const [table,key,fields] = this.useFields();
                const reference = context.metadata.__reference__ as Function;
                const data =  await reference(knex(table).where(condition).select(fields));
                return this.setData2Column(data)[0];
            }
            async find(condition: Record<string, any>): Promise<any[]> {
                const [table,key,fields] = this.useFields();
                const reference = context.metadata.__reference__ as Function;
                const data =  await reference(knex(table).where(condition).select(fields));
                return this.setData2Column(data);
            }
            async findOneById(id: string | number): Promise<any> {
                const [table,key,fields] = this.useFields();
                const reference = context.metadata.__reference__ as Function;
                const data =  await reference(knex(table).where(key,id).select(fields).first());
                return this.setData2Column([data])[0];
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
                const key = (context.metadata.__primaryKey__ as column_type).field_name as string;
                const fields = (context.metadata.__columns__ as column_type[]).map(item=>item.field_name)
                const fieldsMap = (context.metadata.__columns__ as column_type[]).map(item=>({field:item.field_name,column:item.column_name,defaultValue:item.defaultValue}))
                return [table,key,fields,fieldsMap]
            }

            private setData2Column(data:any[]){
                // column to field map
                const c2f = context.metadata.__columnMap2field__;
                const thisTableC2F = _.get(c2f,table);
                const columns = context.metadata.__columns__
                
                data = data.map(item=>{
                    for(let v of columns as column_type[]){
                        if(!!v.referenceColumn){
                            const referenceColumn = v.referenceColumn as string;
                            const table = v.table_name as string;
                            item = convertToNested(item,referenceColumn,table,c2f[table])
                        }
                    }
                    return item;
                }).map(item=>{
                    return _.mapKeys(item,(value,key)=>{
                        return thisTableC2F[key] || key
                    })
                })
                return data;
            }
        }
        IocContainer.instance.set(target, new target());
        return target 
    };
};


const voidFn = () => null;
const STFn = <T>(arg:T) => arg;
/**
 * @description 一般用于普通行
 * @Column({field:'id',length:255,type:'int'})
 * public id : number;
 */
function Column(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        setImmediate(()=>{
            const column_name = context.name;
            let field_name = config.filed || _.snakeCase((context.name as string));
            field_name = context.metadata.__table__ + '.' + field_name;
            const field_length = config.length || "255";
            const field_type = config.type || "varchar";
            const defaultValue = config.defaultValue || voidFn;
            const column = {column_name, field_name, field_length, field_type, table_name: context.metadata.__table__,defaultValue};
            (context.metadata.__columns__ as any[]).push(column)
            _.set(context.metadata.__columnMap2field__ as Record<string,any>,field_name,column_name);
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
            let field_name = config.filed || _.snakeCase((context.name as string));
            field_name = context.metadata.__table__ + '.' + field_name;
            const field_length = config.length || "20";
            const field_type = config.type || "bigint";
            const defaultValue = config.defaultValue || voidFn;
            const column = {column_name, field_name, field_length, field_type, table_name: context.metadata.__table__,defaultValue};
            (context.metadata.__columns__ as any[]).push(column);
            context.metadata.__primaryKey__ = column;
            _.set(context.metadata.__columnMap2field__ as Record<string,any>,field_name,column_name);
        })
    };
}


function LeftJoin(table: new (...args:any[])=>any, cause: string) {
    const metadata = table[Symbol.metadata]
    if(!metadata.__isEntity__){
        throw DecoratorError(`NotFound DecoratorError: ${table.name} is not a entity`)
    }
    return function (value: any, context: ClassFieldDecoratorContext) {
        setImmediate(()=>{
            const columns = (metadata.__columns__ as column_type[]) .map(item=>{
                item.origin_field_name = item.field_name;
                item.field_name = `${item.field_name} as ormPre__${context.name as string}__${item.field_name}`;
                item.referenceColumn = context.name as string;
                return item;
            });
            const tableName = metadata.__table__ as string;
            const [joinCondition1,joinCondition2] = cause.split('=');
            const referenceCallBack = context.metadata.__reference__ as Function;
            let newCallBack = async (knex : Knex)=> {
                return await referenceCallBack(knex).leftJoin(tableName,function(){
                    this.on(joinCondition1,"=",joinCondition2)  
                })
            };
            context.metadata.__reference__ = newCallBack;
            (context.metadata.__columns__ as any[]).push(...columns)
            for(let value of columns){
                _.set(
                    context.metadata.__columnMap2field__ as Record<string,any>,
                    value.origin_field_name,
                    value.column_name
                );
            }
        })
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
