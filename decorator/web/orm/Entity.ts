import { nextTick } from "process";
import { TarsusOrm } from "./TarsusOrm";
import { singal_add_property} from "./Tools";

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
        const _column_ = { column_name, filed_name, filed_length, filed_type };
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            vm.__columns__[filed_name] = _column_;
            singal_add_property(vm,"fields","[]",_column_);
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
        const _column_ = { column_name, filed_name, filed_length, filed_type };
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            vm.__columns__[filed_name] = _column_;
            singal_add_property(vm,"fields","[]",_column_);
            singal_add_property(vm,"__index__","{}",_column_);
        });
    };
}

function Keyword(field?:string){
    return function(value:any,context:ClassFieldDecoratorContext){
        let __keyword__ = field || context.name;
        context.addInitializer(function () {
            let vm = this.constructor.prototype
            singal_add_property(vm,"__keyword__","{}", __keyword__)
        });
    }
}

/**
* @description 一对一的关系
    默认两边主键相连接
*/
function OneToOne(){
    return function (value:any,context:ClassFieldDecoratorContext){

    }
}


/**
* @description 一对多的关系
    一个主键、对应多个列，返回一个列表
*/
function OneToMany(){
    return function (value:any,context:ClassFieldDecoratorContext){

    }
}

/**
* @description 多对一的关系
    多个列对应另一个表中的一列
*/
function ManyToOne(){
    return function (value:any,context:ClassFieldDecoratorContext){

    }
}

/**
* @description 两边如何关联
*/
function JoinColumn(){
    return function (value:any,context:ClassFieldDecoratorContext){

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
