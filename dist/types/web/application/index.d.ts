/// <reference types="node" />
import { TarsusHttpApplication } from "./TarsusServer";
import { EventEmitter } from 'node:events';
declare const ApplicationEvents: EventEmitter;
declare enum Application {
    LOAD_SERVER = "loadserver",
    LOAD_PIPE = "loadpipe",
    LOAD_LISTEN = "loadlisten",
    LOAD_CONFIG = "loadconfig",
    LOAD_DATABASE = "loaddatabase",
    LOAD_INIT = "loadinit",
    LOAD_MS = "loadms"
}
declare function ArcInstance<T extends new () => void>(BASE: T): InstanceType<T>;
export { TarsusHttpApplication, ApplicationEvents, Application, ArcInstance };
