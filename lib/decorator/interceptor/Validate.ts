import moment from 'moment';
import validator from 'validator';
import _ from 'lodash';

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

type IObj = Record<string, any>;
type IClass = new (...args: any[]) => any;

export function TarsusValidate(argument: any) { 
    // debugger;
    const metadata  = argument.__proto__.constructor[Symbol.metadata];
    const instance  = argument;
    const fields:string[] = _.uniq(metadata.__records__);
    return fields.every(field=>{
        const validateItems = _.get(metadata,field) as Function[]
        return validateItems.every(func=>func(_.get(instance, field)))
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

function classToPlain(instance: any) { }

export function DataTransferOBJ() {
    return function (val: any, context: ClassDecoratorContext) {

    };
}


function __IsInt(val: any): boolean {
    return Number.isInteger(val);
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

function __IsString(val: any) {
    return typeof val === "string";
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

function __IsNumber(val: any) {
    return typeof val === "number";
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
    return Array.isArray(val);
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
    return val.length >= min;
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
    return val.length <= max;
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
    return val.trim().length > 0;
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
    return typeof val === "boolean";
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
    return validator.isURL(val);
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
