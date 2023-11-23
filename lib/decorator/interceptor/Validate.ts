import moment from 'moment';
import validator from 'validator';
import _ from 'lodash';
import { TarsusError, TypeCheckError } from '../http/error';

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

type IObj = Record<string, any>;
type IClass = new (...args: any[]) => any;

// https://juejin.cn/post/7277797749886418998 typecheck || throw Error在 typescript 中不被支持

export function TarsusValidate(argument: any) { 
    // debugger;
    const metadata  = argument.__proto__.constructor[Symbol.metadata];
    const instance  = argument;
    const fields:string[] = _.uniq(metadata.__records__);
    return fields.every(field=>{
        const validateItems = _.get(metadata,field) as Function[]
        const validate = validateItems.every(func=>func(_.get(instance, field)));
        if(!validate){
            throw TypeCheckError(`ValidateError:${field}`)
        }
        return validate
    })
}

export function plainToInstance(obj: IObj, target: IClass) { 
    const instance  = new target();
    const metadata  = target[Symbol.metadata];
    const fields    = _.uniq((metadata.__records__ as unknown as string[]));
    for(let key of fields){
        _.set(instance,key,obj[key]);
    }
    return instance
}

function TransformObjToValidate(obj:IObj,target: IClass){
    const instance = plainToInstance(obj,target)
    return TarsusValidate(instance)
}

export const TarsusDTO = TransformObjToValidate;

export function classToPlain(instance: any) {
  if (typeof instance.toJSON === 'function') {
    return instance.toJSON();
  }
  const plainObj = {};
  for (const prop in instance) {
    if (instance.hasOwnProperty(prop)) {
      plainObj[prop] = instance[prop];
    }
  }
  return plainObj;
 }

export function DataTransferOBJ() {
    return function (val: any, context: ClassDecoratorContext) {
        context.metadata.__isDTO__ = true;
    };
}


function __IsInt(val: any): boolean {
    if(!Number.isInteger(val)) throw TypeCheckError(`TypeError:${val} is not a int value`);
    return true;
}
export function IsInt() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsInt(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __IsString(val: any):boolean {
    if(!(typeof val === "string"))  throw TypeCheckError(`TypeError:${val} is not a string value`);
    return true
}

export function IsString() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsString(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __IsNumber(val: any):boolean {
    if(!(typeof val === "number"))throw TypeCheckError(`TypeError:${val} is not a string value`);
    return true;
}

export function IsNumber() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsNumber(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}
function __IsArray(val: any) {
    if(!_.isArray(val)) throw TypeCheckError(`TypeError:${val} is not a Array`);
    return true
}

export function IsArray() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsArray(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __MinLen(val: any, min: number) {
    if(!(val.length >= min)) throw TypeCheckError(`ValueError: value ${val} , min ${min}`);
    return true
}

export function MinLen(min: number) {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __MinLen(value, min);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __MaxLen(val: any, max: number) {
    if(!(val.length <= max))  throw TypeCheckError(`ValueError: value ${val} , max ${max}`);
    return true;
}

export function MaxLen(max: number) {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __MaxLen(value, max);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __IsNotEmpty(val: string): boolean {
    if(!val || !(val.trim().length > 0)) throw TypeCheckError(`ValueError:${val} is an empty value`);
    return true;
}

export function IsNotEmpty() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsNotEmpty(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __IsBool(val: any): boolean {
    if(!(typeof val === "boolean")) throw TypeCheckError(`TypeError:${val} is not a boolean value`);
    return true;
}

export function IsBool() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsBool(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}


function __MinDate(date: string, minDate: string): boolean {
    return moment(date).isSameOrAfter(minDate);
}

export function MinDate(minDate: string) {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __MinDate(value, minDate);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __MaxDate(date: string, maxDate: string): boolean {
    return moment(date).isSameOrBefore(maxDate);
}

export function MaxDate(maxDate: string) {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __MaxDate(value, maxDate);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

function __IsObject(val: any): boolean {
    return typeof val === "object" && !Array.isArray(val) && val !== null;
}

export function IsObject() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsObject(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}


function __IsUrl(val: string): boolean {
    if(!(validator.isURL(val))) throw TypeCheckError(`TypeError:${val} is not a url`);
    return true;
}

export function IsUrl() {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => __IsUrl(value);
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}


export function CheckStatus(status:Array<number>) {
    return function (val: any, context: ClassFieldDecoratorContext) {
        const name = context.name as string;
        if (!context.metadata[name]) context.metadata[name] = [];
        if (!context.metadata.__records__) context.metadata.__records__ = [];
        (context.metadata.__records__ as string[]).push(name);
        const validateFunction = (value) => {
            value = _.toNumber(value);
            return _.isNumber(value) && status.includes(value)
        };
        (context.metadata[name] as Function[]).push(validateFunction)
    }
}

export const Required = IsNotEmpty;

