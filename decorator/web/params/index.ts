/**
 * @description
 * typescript 5.0.0 暂不支持 ParamterDecorator
 */
function Query(){
    return function(value:any,context:any){
        console.log("QUERY 装饰器");
    }
}

function Body(){

}
export {
    Body,Query
}