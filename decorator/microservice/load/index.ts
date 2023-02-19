import { EventEmitter } from 'node:events';

const ApplicationEvents = new EventEmitter();

enum Application{
    LOAD_INTERFACE = "loadinterface",
    LOAD_MICROSERVICE = "loadmicroservice",
    GET_INTERFACE = "getinterface"
}

function loadMicroService(){
    ApplicationEvents.emit(Application.LOAD_MICROSERVICE)
}

function loadInterFace(args:any[]){
    ApplicationEvents.emit(Application.LOAD_INTERFACE,args)

}
export {
    Application,
    loadMicroService,
    loadInterFace,
    ApplicationEvents
}