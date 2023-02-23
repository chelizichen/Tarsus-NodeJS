/// <reference types="node" />
import { ArcHttpApplication } from "./ArcServer";
import { EventEmitter } from 'node:events';
declare const ApplicationEvents: EventEmitter;
declare enum Application {
    LOAD_SERVER = "loadserver",
    LOAD_PIPE = "loadpipe",
    LOAD_LISTEN = "loadlisten",
    LOAD_CONFIG = "loadconfig",
    LOAD_DATABASE = "loaddatabase",
    LOAD_INIT = "loadinit"
}
declare function ArcInstance<T extends new () => void>(BASE: T): InstanceType<T>;
export { ArcHttpApplication, ApplicationEvents, Application, ArcInstance };
