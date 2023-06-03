import { nextTick } from "process";
import { TarsusOrm } from "./TarsusOrm";

interface ColumnType {
    filed?: string;
    type?: string;
    length?: number;
}

interface column_type {
    column_name: string;
    filed_name: string;
    filed_length: string | number;
    filed_type: string;
}

interface __column__ {
    [key: string]: column_type;
}

/**
 * @description 存储每个实体的实例对象
 */
export const TarsusEntitys = {}


// abstract class OrmMethods {
//     abstract getList(pagination: Pagination);
// }


/**
 * @param table 数据库中的表
 */
const Entity = (table: string) =>{
    return function(
        proto: new () => any,
        context: ClassDecoratorContext
    ) {
        // TarsusOrm.call(proto);

        const table_name = table || proto.name;

        proto.prototype = TarsusOrm.prototype;
        proto.prototype.__table__ = table_name;
        proto.prototype.__columns__ = {};
    
        const inst = new proto()
        // const tarsusOrm = new TarsusOrm();
    
        TarsusEntitys[table_name] = inst;
        context.addInitializer(function () {
            const vm = this;
            // const ormMethods = new TarsusOrm()
            // this.call(ormMethods);
            nextTick(() => {
                console.log(vm.prototype);
            });
        });
    };
};

/**
 * @description 一般用于普通行
 */
function Column(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const column_name = context.name;
        const filed_name = config.filed || (context.name as string);
        const filed_length = config.length || "255";
        const filed_type = config.type || "varchar";
        const _column = { column_name, filed_name, filed_length, filed_type };
        context.addInitializer(function () {
            this.constructor.prototype.__columns__[filed_name] = _column;
        });
    };
};

/**
 * @description 一般用于主键
 */
function PrimaryGenerateColumn(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const column_name = context.name;
        const filed_name = config.filed || (context.name as string);
        const filed_length = config.length || "20";
        const filed_type = config.type || "bigint";
        const _column = { column_name, filed_name, filed_length, filed_type };
        context.addInitializer(function () {
            // @ts-ignore
            // console.log('proto',this);
            
            this.constructor.prototype.__columns__[filed_name] = _column;
        });
    };
}

// f


export { Entity, Column, PrimaryGenerateColumn, __column__ };
