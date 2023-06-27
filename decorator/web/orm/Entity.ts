import { nextTick } from "process";
import { TarsusOrm } from "./TarsusOrm";
import { addReference, singal_add_property, SQLTools } from "./Tools";
import _ from 'lodash';



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
    ) {
        proto.prototype.__ormMethods__ = new TarsusOrm();
        // ORM 工具 
        // const tarsusOrm = new TarsusOrm()
        const table_name = table || proto.name;
        proto.prototype.__table__ = table_name;
        proto.prototype.__columns__ = {};
        proto.prototype.__reference__ = [];
        
        let inst = new proto();
        // inst. = Object.assign(inst,tarsusOrm)
        TarsusEntitys[proto.prototype] = inst;
        // 这一步中 我们需要对数据库的查询语句做进一步的修改操作
        context.addInitializer(function () {
            const vm = this;
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
        const _column_ = { column_name, filed_name, filed_length, filed_type, table_name: '' };
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            _column_.table_name = vm.__table__
            singal_add_property(vm, "fields", "[]", _column_);
        });
    };
}

/**
 * @description 一般用于主键
 */
function PrimaryGenerateColumn(config: ColumnType) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const column_name = context.name;
        const filed_name = config.filed || (context.name as string);
        const filed_length = config.length || "20";
        const filed_type = config.type || "bigint";
        const _column_ = { column_name, filed_name, filed_length, filed_type, table_name: '' };
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            _column_.table_name = vm.__table__
            singal_add_property(vm, "fields", "[]", _column_);
            singal_add_property(vm, "__index__", "{}", _column_);
        });
    };
}

function Keyword(field?: string) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        let __keyword__ = field || context.name;
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            singal_add_property(vm, "__keyword__", "{}", __keyword__)
        });
    }
}

/**
 * @description 一对一的关系
 默认两边主键相连接
 */
function OneToOne<T = TarsusConstructor, R = string>(targetEntity: T, referenceColumn: R) {
    // 将需要注入的实体和引用的行进行关联
    return function (value: any, context: ClassFieldDecoratorContext) {
        //        context
    }
}


/**
 * @description 一对多的关系
 一个主键、对应多个列，返回一个列表
或许两次查询SQL是一个好的选择
    {
        a:'',
        b:'',
        c:{
            d:'1',
            e:'1',
        }
        f:[
            { x:111,y:222},
            { x:222,y:333},
        ]
    }
 */
function OneToMany<T extends TarsusConstructor = any, R = string>(targetEntity: T, referenceColumn: R) {

    return function (value: any, context: ClassFieldDecoratorContext) {
        let inst;
        if (!TarsusEntitys[targetEntity.prototype]) {
            inst = new targetEntity();
            TarsusEntitys[targetEntity.prototype] = inst;
        }
        inst = TarsusEntitys[targetEntity.prototype];

        const referenceTable = inst.__table__;
        const referenceEntity = inst;
        
        context.addInitializer(function () {
            // debugger;
            let vm = this.constructor.prototype
            let ref = {
                type: "[]",
                referenceColumn: referenceColumn,
                referenceTable: referenceTable,
                referenceEntity: referenceEntity,
                columnName: context.name
            }
            addReference(vm, "__reference__", "[]", {[context.name]:ref})
        })

    }
}

/**
 * @description 多对一的关系
 多个列对应另一个表中的一列
    {
        a:'',
        b:'',
        c:{
            d:'1',
            e:'1',
        }
    }
 */
function ManyToOne<T = TarsusConstructor, R = string>(targetEntity: T, referenceColumn: R) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const name = context.name;
        const referenceTable = targetEntity.constructor.prototype.__table__;
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            Object.assign(vm.__columns__[name], {
                type: "{}",
                referenceColumn: referenceColumn,
                referenceTable: referenceTable
            })
        })
    }
}

/**
 * @description 两边如何关联
    @param joinColumn 主要用于如何关联其他表，以自身提供一个表

 */
function JoinColumn(joinColumn: string) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        context.addInitializer(function () {
            console.log("join");
            
            // debugger;
            let vm = this.constructor.prototype
            let ref = {
                joinColumn: joinColumn,
                columnName: context.name
            }
            addReference(vm, "__reference__", "[]", {[context.name]:ref})
        })
    }
}


// f


export {
    __column__,
    Entity,
    Column,
    PrimaryGenerateColumn,
    Keyword,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne
};
