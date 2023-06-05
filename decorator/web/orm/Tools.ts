/**
    @desc SqlUtils 
*/
import { column_type } from "./Entity";
import { Pagination } from "./Repo";


let SQLTools = function (proto: any) {
    const { fields, __table__ } = proto
    this.addColumn(fields)
    this.sql_select_from = ""
    this.entity = proto;
    this.sql_base_where = " where 1 = 1 and "
    this.sql_where = ""
    this.sql_pagination = ""
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

SQLTools.prototype.buildWhere = function (options) {
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
 * 
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

SQLTools.prototype.getSQL = function () {
    let {
        sql_select_from,
        sql_base_where,
        sql_where,
        sql_pagination
    } = this;
    // 如果 没进行where 查询 则base 为空
    if(sql_where == ""){
        sql_base_where = ""
    }
    const sql = sql_select_from + sql_base_where + sql_where + sql_pagination;
    console.log('sql',sql);
    
    return sql;

}

function singal_add_property(proto, property, args) {
    if (!proto[property]) {
        proto[property] = []
    }
    proto[property].push(args)
}

function singal_get_property(proto, property) {
    return proto[property]
}
export {
    SQLTools,
    singal_add_property,
    singal_get_property
}