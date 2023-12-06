import _ from 'lodash';

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

export function Logger(log:string,ignoreResult:boolean){
    return function(originalMethod: any, _context: any){
        function replacementMethod(this: any, ...args: any[]) {
            console.log(log,' | arguments |  ',args)
            const result = originalMethod.call(this, ...args);
            !ignoreResult && console.log(log,' | result | ',result)
            return result;
        }
        return replacementMethod;
    }
}


export function Override(originalMethod: any, _context: ClassMethodDecoratorContext){
    if(_context.kind != "method"){
        throw new Error("OverRide Error")
    }
}


export function WillOverride(originalMethod: any, _context: ClassMethodDecoratorContext){
    if(_context.kind != "method"){
        throw new Error("OverRide Error")
    }
}


export function DefineStruct(_t_className:string){
    return function(clazz: any, _context: ClassDecoratorContext){
        clazz._t_className = _t_className
    }
}

export function DefineField(tag:number){
    return function(clazz:any,_context:ClassFieldDecoratorContext){
        _.set(_context.metadata,`Tag.${tag}`,_context.name as string);
    }
}

export function Module(moduleServer:any){
    return function(clazz: any, _context: ClassDecoratorContext){
        _context.addInitializer(function(){
            
        })
    }
}
