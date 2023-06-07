import {nextTick} from "process";
import {TarsusOrm} from "./TarsusOrm";
import {singal_add_property, SQLTools} from "./Tools";
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
}

interface __column__ {
    [key: string]: column_type;
}

/**
 * @description 存储每个实体的实例对象
 */
export const TarsusEntitys = {}

export type TarsusConstructor<T = any> = new (...args: any[]) => T


// abstract class OrmMethods {
//     abstract getList(pagination: Pagination);
// }


/**
 * @param table 数据库中的表
 */
const Entity = (table: string) => {
    return function (
        proto: new () => any,
        context: ClassDecoratorContext
    ) {
        // TarsusOrm.call(proto);

        const table_name = table || proto.name;

        proto.prototype = TarsusOrm.prototype;
        proto.prototype.__table__ = table_name;
        proto.prototype.__columns__ = {};
        proto.prototype.__reference__ = [];

        const inst = new proto()
        // const tarsusOrm = new TarsusOrm();

        TarsusEntitys[table_name] = inst;
        context.addInitializer(function () {
            const vm = this;
            // const ormMethods = new TarsusOrm()
            // this.call(ormMethods);
            nextTick(() => {
                let reference = vm.prototype.__reference__
                reference =  reference.map(item=>{
                    let sql = undefined;
                    console.log('item',item)
//                    let tools = new SQLTools(item.referenceEntity);
                    item.getReferenceRow = function (referenceValue:string){

//                        tools
                    }
//                    entity
                })
                // console.log(vm.prototype.fields)
                // new SQLTools(vm.prototype)

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
        const _column_ = {column_name, filed_name, filed_length, filed_type};
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            vm.__columns__[filed_name] = _column_;
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
        const _column_ = {column_name, filed_name, filed_length, filed_type};
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            vm.__columns__[filed_name] = _column_;
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
function OneToMany<T = TarsusConstructor, R = string>(targetEntity: T,referenceColumn:R) {
    return function (value: any, context: ClassFieldDecoratorContext) {
//        const inst = new targetEntity<any>()
        // const tarsusOrm = new TarsusOrm();


        const name = context.name;
        const referenceTable = targetEntity.constructor.prototype.__table__;
        const referenceEntity = targetEntity.constructor.prototype;
        console.log("proto",referenceEntity)
        context.addInitializer(function (){
            let vm = this.constructor.prototype
            let ref = vm.__columns__[name] || {}
            Object.assign(ref,{
                type:"[]",
                referenceColumn:referenceColumn,
                referenceTable:referenceTable,
                referenceEntity:referenceEntity
            })
            singal_add_property(vm, "__reference__", "[]",ref)
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
function ManyToOne<T = TarsusConstructor, R = string>(targetEntity: T,referenceColumn:R) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const name = context.name;
        const referenceTable = targetEntity.constructor.prototype.__table__;
        context.addInitializer(function (){
            let vm = this.constructor.prototype
            Object.assign(vm.__columns__[name],{
                type:"{}",
                referenceColumn:referenceColumn,
                referenceTable:referenceTable
            })
        })
    }
}

/**
 * @description 两边如何关联
    @param joinColumn 主要用于如何关联其他表，以自身提供一个表

 */
function JoinColumn(joinColumn:string) {
    return function (value: any, context: ClassFieldDecoratorContext) {
        const name = context.name;
        context.addInitializer(function (){
            let vm = this.constructor.prototype
            let ref = vm.__columns__[name] || {}
            Object.assign(ref,{
                joinColumn:joinColumn
            })
            singal_add_property(vm, "__reference__", "[]",ref)
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
