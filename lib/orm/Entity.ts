import {Repository} from "./Repo";
import {TarsusOrm} from "./TarsusOrm";
import {addReference, singal_add_property, SQLTools} from "./Tools";

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");


interface ColumnType {
    filed?: string;
    type?: string;
    length?: number;
}

export interface column_type {
    column_name: string;
    filed_name: string;
    filed_length: string | number;
    filed_type: string;
    table_name: string;
}

interface __column__ {
    [key: string]: column_type;
}

/**
 * @description 存储每个实体的实例对象
 */
export const TarsusEntitys = {}

export type TarsusConstructor<T = any> = new (...args: any[]) => T


/**
 * @param table 数据库中的表
 */
const Entity = (table: string) => {
    return function (
        proto: new () => any,
        context: ClassDecoratorContext
    ){
        context.metadata.__table__ = table;    // 定义表
        context.metadata.__columns__ = [];       // 定义表的列
        context.metadata.__reference__ = [];       // 定义其他的引用 例如 leftJoin rightJoin join
        context.metadata.__primaryKey__ = {};       // 主键

        proto.prototype.save = function () {

        }
        proto.prototype.update = function () {

        }

        proto.prototype.insert = function () {

        }

        proto.prototype.delete = function () {

        }

        proto.prototype.delById = function () {

        }

        proto.prototype.getById = function () {

        }

        proto.prototype.query = function () {

        }

        proto.prototype.queryList = function () {

        }
    };
};


/**
 * @description 一般用于普通行
 * @Column({field:'id',length:255,type:'int'})
 * public id : number;
 */
function Column(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        setImmediate(()=>{
            const column_name = context.name;
            const filed_name = config.filed || (context.name as string);
            const filed_length = config.length || "255";
            const filed_type = config.type || "varchar";
            const column = {column_name, filed_name, filed_length, filed_type, table_name: context.metadata.__table__};
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
            const column = {column_name, filed_name, filed_length, filed_type, table_name: context.metadata.__table__};
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

@Entity('user')
class User {
    @PrimaryGenerateColumn({length: 20, filed: 'id', type: 'int'})
    public id: number;

    @Column({length: 255, filed: 'user_name', type: 'varchar'})
    public userName: string;

    @Column({length: 20, filed: 'age', type: 'varchar'})
    public age: number;

    @Column({length: 255, filed: 'phone_number', type: 'varchar'})
    public phoneNumber: string;
}


const user = new User() as Repository<User>;

console.log(user.save);
user.userName = "11"
console.log(user.userName);

export {
    __column__,
    Entity,
    Column,
    PrimaryGenerateColumn,
    LeftJoin,
    Join,
    RightJoin,
};
