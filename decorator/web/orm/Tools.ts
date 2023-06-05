/**
    @desc SqlUtils 
*/
import {column_type} from "./Entity";

let SQLTools = function (proto:any){
    const {fields,__table__} = proto
    this.entity = proto;
    this.sql_list =  this.getList(fields,__table__)
    this.addColumn(fields)
    this.sql_base_where =  "where 1 = 1 "
//    this.buildWhere({
//        fundCode:1,
//        fundEngName:'222'
//    })
//    console.log(this.sql_list)
}

SQLTools.prototype.getList = function (args:Array<column_type>,tableName:string){
    let select = "select "
    let from = " from " + tableName
    let params = args.map(item=>{
        return  `${tableName}.${item.filed_name} as ${item.column_name}`
    }).join(",")
    this.sql_select_from = select + params + from
    return this;
}

SQLTools.prototype.addColumn = function (args:Array<column_type>){
    args.forEach(item=>{
        SQLTools.prototype[item.column_name] = item.filed_name;
    })
}

SQLTools.prototype.buildWhere = function (options){
    let where_sql = ''
    for (let v in options){
        where_sql += `${this[v]} = ${options[v]}`
        console.log(this[v],options[v])
    }
    this.sql_where = where_sql;
    return this;
}

SQLTools.prototype.buildAnd = function (){

}

SQLTools.prototype.buildOr = function (){
    
}


SQLTools.prototype.leftJoin = function (table:string, condition) {
    this.sql_leftjoin = " left join " + table + " on " + condition;
    return this
}

SQLTools.prototype.rightJoin = function (table:string, condition) {
    this.sql_rightjoin = " right join " + table + " on " + condition;
    return this;
}

SQLTools.prototype.join = function (table:string, condition) {
    this.sql_join = "  join " + table + " on " + condition;
    return this
}

export {
    SQLTools
}