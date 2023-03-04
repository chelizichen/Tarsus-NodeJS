import { IocMap } from "../../ioc/collects";
import { TarsusHttpApplication } from "./TarsusServer";
import {EventEmitter} from 'node:events'

const ApplicationEvents = new EventEmitter();


enum Application{
    LOAD_SERVER="loadserver",
    LOAD_PIPE="loadpipe",
    LOAD_LISTEN="loadlisten",
    LOAD_CONFIG="loadconfig",
    LOAD_DATABASE="loaddatabase",
    LOAD_INIT="loadinit",
    LOAD_MS="loadms"
}

function ArcInstance<T extends new ()=>void>(BASE:T):InstanceType<T>{
    const hasInst = IocMap.get(BASE.name)
    if(hasInst){
        return hasInst
    }else{
        const INST = new BASE()
        IocMap.set(BASE.name,INST)
        return INST as InstanceType<T>
    }
}

export { TarsusHttpApplication, ApplicationEvents, Application, ArcInstance };