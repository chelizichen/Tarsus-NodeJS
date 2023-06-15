/**
 * @deprecated
 */
const Select = (sql:string) =>{
    return function(value:any,context:ClassMethodDecoratorContext){
        const copy_value = value;
        
        // 修改原函数
        value = async function(args:any){
            let _args = {
                args,
                sql
            }
            return await copy_value(_args)
        }
        return value
    }
}

export {
    Select
}