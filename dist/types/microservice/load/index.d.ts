/// <reference types="node" />
import { EventEmitter } from 'node:events';
declare const ApplicationEvents: EventEmitter;
declare enum Application {
    LOAD_INTERFACE = "loadinterface",
    LOAD_MICROSERVICE = "loadmicroservice",
    GET_INTERFACE = "getinterface"
}
declare function loadMicroService(): void;
declare function loadInterFace(args: any[]): void;
export { Application, loadMicroService, loadInterFace, ApplicationEvents };
