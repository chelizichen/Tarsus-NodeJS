import { nextTick } from "process";
import { TarsusOrm } from "./TarsusOrm";
import {SQLTools} from "./Tools";

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
}

interface __column__ {
    [key: string]: column_type;
}

/**
 * @description 存储每个实体的实例对象
 */
export const TarsusEntitys = {}


function singal_add_property(proto,property,args){
    if(!proto[property]){
        proto[property] = []
    }
    proto[property].push(args)
}

function singal_get_property(proto,property){
    return proto[property]
}


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
                console.log(vm.prototype.fields)
                new SQLTools(vm.prototype)

            })
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
        const _column_ = { column_name, filed_name, filed_length, filed_type };
        context.addInitializer(function () {
            this.constructor.prototype.__columns__[filed_name] = _column_;
            singal_add_property(this.constructor.prototype,"fields",_column_);
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
        const _column_ = { column_name, filed_name, filed_length, filed_type };
        context.addInitializer(function () {
            this.constructor.prototype.__columns__[filed_name] = _column_;
            singal_add_property(this.constructor.prototype,"fields",_column_);
        });
    };
}

// f


export { Entity, Column, PrimaryGenerateColumn, __column__ };
