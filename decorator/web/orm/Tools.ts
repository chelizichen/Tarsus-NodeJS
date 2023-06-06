/**
 @desc SqlUtils
 */
import {column_type} from "./Entity";
import {Pagination} from "./Repo";


let SQLTools = function (proto: any) {
    const {fields, __table__, __index__} = proto
    this.addColumn(fields)
    this.__table__ = __table__
    this.__index__ = __index__
    this.entity = proto;


    // 查询的sql
    this.sql_select_from = ""

    // where 构建的sql
    this.sql_base_where = " where 1 = 1 and "
    this.sql_where = ""

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

SQLTools.prototype.getList = function (args: Array<column_type>, tableName: string) {
    let select = "select "
    let from = " from " + tableName
    let params = args.map(item => {
        return `${tableName}.${item.filed_name} as ${item.column_name}`
    }).join(",")
    this.sql_select_from = select + params + from
}

SQLTools.prototype.addColumn = function (args: Array<column_type>) {
    args.forEach(item => {
        SQLTools.prototype[item.column_name] = item.filed_name;
    })
}

SQLTools.prototype.buildWhere = function (options: Record<string, string>) {
    let where_sql = ''
    for (let v in options) {
        where_sql += `${this[v]} = ${options[v]}`
        console.log(this[v], options[v])
    }
    this.sql_where = where_sql;
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
    if (sql_where == "") {
        sql_base_where = ""
    }
    const sql = sql_select_from + sql_base_where + sql_where + sql_pagination;
    console.log('sql', sql);
    return sql;
}

// 先 buildWhere 再 del
SQLTools.prototype.getDelSQL = function () {

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

function singal_get_property(proto, property) {
    return proto[property]
}

export {
    SQLTools,
    singal_add_property,
    singal_get_property
}