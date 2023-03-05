/// <reference types="node" />
import { EventEmitter } from 'node:events';
declare const ApplicationEvents: EventEmitter;
declare enum Application {
    LOAD_INTERFACE = "loadinterface",
    LOAD_MICROSERVICE = "loadmicroservice",
    GET_INTERFACE = "getinterface",
    REQUIRE_INTERFACE = "require_interface"
}
declare function loadMicroService(): void;
declare function loadInterFace(args?: any[]): void;
export { Application, loadMicroService, loadInterFace, ApplicationEvents, };
