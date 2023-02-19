import { IocMap } from "../../ioc/collects";
import { ArcServer } from "./ArcServer";
import {EventEmitter} from 'node:events'

const ApplicationEvents = new EventEmitter();


enum Application{
    LOAD_SERVER="loadserver",
    LOAD_PIPE="loadpipe",
    LOAD_LISTEN="loadlisten",
    LOAD_CONFIG="loadconfig",
    LOAD_DATABASE="loaddatabase"
}

function ArcInstance(BASE){
    const hasInst = IocMap.get(BASE.name)
    if(hasInst){
        return hasInst
    }else{
        const INST = new BASE()
        IocMap.set(BASE.name,INST)
        return INST
    }
}

export { ArcServer,ApplicationEvents,Application,ArcInstance };