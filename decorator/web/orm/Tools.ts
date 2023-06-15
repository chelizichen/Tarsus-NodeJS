/**
 @desc SqlUtils
 */
import {column_type} from "./Entity";
import {Pagination} from "./Repo";
import _ from 'lodash'

let SQLTools = function (proto: {fields:Array<column_type>;__table__:string;__index__:string;__reference__:any[]}) {
    // 继承
    
    const { fields, __table__, __index__, __reference__ } = proto
    // console.log('fields',fields);
    // console.log('__table__',__table__);
    // console.log('__index__',__index__);
    // console.log('__reference__',__reference__);
    
    this.__table__ = __table__
    this.__index__ = __index__

    // reference 代表有多少个引用
    this.handleReference(__reference__)
    
    this.addColumn(fields)

    this.entity = proto;

    // 查询的sql
    this.sql_select_from = ""

    // where 构建的sql
    this.sql_base_where = " where 1 = 1 and "
    this.sql_where = []

    // 分页的sql
    this.sql_pagination = ""

    // 只删一个的sql
    this.sql_delOne = "" // 构建del 的sql

    // 构建删除的sql
    this.sql_del = "" // 构建del 的sql

    this.getList(fields, __table__)

    //    this.buildWhere({
    //        fundCode:1,
    //        fundEngName:'222'
    //    })
    //    console.log(this.sql_list)
}


/**
 * @description 拿到表 字段 做处理
 */
SQLTools.prototype.handleReference = function(__reference__){
    __reference__ = mergeObjectsBySameKey(__reference__)
    console.log(__reference__);
    
}

SQLTools.prototype.getList = function (args: Array<column_type>, tableName: string) {
    let select = "select "
    let from = " from " + tableName
    
    let params = args.map(item => {
        return `${tableName}.${item.filed_name} as ${item.column_name}`
    }).join(",")
    
    // let referenceColumns = this.referenceColumns.map((item,index)=>{
    //     const {referenceTable,referenceColumn,targetTable,joinColumn,column_name,columnName,filed_name,table_name} = item
    //     if(!index)this.sql_where.push(` ${referenceTable}.${referenceColumn} = ${targetTable}.${joinColumn} `);
    //     // 大写的columnName 为当前实体的属性 小写的 column_name 为对应实体关系里面的属性
    //     return ` ${table_name}.${filed_name} as '${columnName}.${column_name}'              `
    // }).join(",")

    // if(referenceColumns){
    //     params += ","
    // }
    console.log(select);
    console.log(params);
    // console.log(referenceColumns);
    
    this.sql_select_from = select + params  + from
    // this.sql_where += 
    // this.handleData = function(data){
        
    // }
}

SQLTools.prototype.addColumn = function (args: Array<column_type>) {
    args.forEach(item => {
        SQLTools.prototype[item.column_name] = item.filed_name;
    })
}

SQLTools.prototype.buildWhere = function (options: Record<string, string>) {
    // let where_sql = ''
    for (let v in options) {
        this.sql_where.push(`${this[v]} = ${options[v]}`)
        // console.log(this[v], options[v])
    }
    return this;
}

SQLTools.prototype.buildAnd = function () {

}

SQLTools.prototype.buildOr = function () {

}


SQLTools.prototype.leftJoin = function (table: string, condition) {
    this.sql_leftjoin = " left join " + table + " on " + condition;
    return this
}

SQLTools.prototype.rightJoin = function (table: string, condition) {
    this.sql_rightjoin = " right join " + table + " on " + condition;
    return this;
}

SQLTools.prototype.join = function (table: string, condition) {
    this.sql_join = "  join " + table + " on " + condition;
    return this
}
/**
 * @param pagination
 */
SQLTools.prototype.pagination = function (pagination: Pagination) {
    let [sort, limit] = ['', '']
    if (pagination.sort) {
        sort = `
            sort by 
            ${pagination.sort} 
            ${pagination.desc} 
        `
    }
    if (pagination.page && pagination.size) {
        limit = `
            limit
            ${pagination.getOffset()},
            ${pagination.size}
        `;
    }

    // 默认ID排序


    this.sql_pagination = sort + limit;
    return this;
};

// 默认为List 的
SQLTools.prototype.getSQL = function () {
    let {
        sql_select_from,
        sql_base_where,
        sql_where,
        sql_pagination
    } = this;
    // 如果 没进行where 查询 则base 为空
    if (sql_where.length == 0) {
        sql_base_where = ""
    }else{
        sql_where = sql_where.join(' and ')
    }
    const sql = sql_select_from + sql_base_where + sql_where + sql_pagination;
    return sql;
}

// 先 buildWhere 再 del
SQLTools.prototype.getDelSQL = function () {
    return `
        delete from ${this.__table__} ${this.sql_base_where} ${this.sql_where}
    `;
}

// 快捷方法 只del一个 根据主键
SQLTools.prototype.delOne = function (index: string) {
    console.log(this.__index__)
    this.sql_delOne = `delete
                       from ${this.__table__}
                       where ${this.__index__.filed_name} = ${index}`
    return this.sql_delOne
}


function singal_add_property(proto, property, type, args) {
    if (type === "[]") {
        if (!proto[property]) {
            proto[property] = []
        }
        proto[property].push(args)
    }
    if (type === "{}") {
        if (!proto[property]) {
            proto[property] = {}
        }
        proto[property] = args;
    }
}

function addReference(proto, property, type, args){
    if (type === "[]") {

        proto[property].push(args)

        return;
    }
    if (type === "{}") {
        if (!proto[property]) {
            proto[property] = {}
        }
        proto[property] = args;
    }
}

function singal_get_property(proto, property) {
    return proto[property]
}

function mergeObjectsBySameKey(arr) {
    // 使用groupBy函数按照键进行分组
    const grouped = _.groupBy(arr, obj => _.keys(obj)[0]);
  
    // 使用mergeWith函数将具有相同键的对象合并
    const merged = _.mapValues(grouped, group =>
        // @ts-ignore
      _.mergeWith(...group, (objValue, srcValue) => {
        if (_.isArray(objValue)) {
          // 如果属性值是数组，则进行合并
          return _.concat(objValue, srcValue);
        }
      })
    );
  
    // 将合并后的对象转换为数组返回
    return _.values(merged);
  }


export {
    SQLTools,
    singal_add_property,
    singal_get_property,
    addReference
}