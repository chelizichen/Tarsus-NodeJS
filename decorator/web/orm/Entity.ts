import { nextTick } from "process";

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

export interface __column__ {
    [key: string]: column_type;
}

/**
 * @description 存储每个实体的实例对象
 */
const TarsusEntitys = {}

/**
 * @param table 数据库中的表
 */
function Entity(table: string) {
    return function (proto: new () => void, context: ClassDecoratorContext) {
        const table_name = table || proto.name;
        proto.prototype.__table__ = table_name;
        proto.prototype.__columns__ = {}

        const inst = new proto()
        TarsusEntitys[table_name] = inst;

        context.addInitializer(function () {
            const vm = this
            nextTick(() => {
                console.log(vm.prototype);
            })
        })
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
            this.constructor.prototype.__columns__[filed_name] = _column;
        });
    };
}

// f


export { Entity, Column, PrimaryGenerateColumn };
