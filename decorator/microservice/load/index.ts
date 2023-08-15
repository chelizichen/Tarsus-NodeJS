import {EventEmitter} from 'node:events';

const ApplicationEvents = new EventEmitter();

enum Application {
    LOAD_INTERFACE = "loadinterface",
    LOAD_MICROSERVICE = "loadmicroservice",
    GET_INTERFACE = "getinterface",
    REQUIRE_INTERFACE = "requireinterface",
    LOAD_TARO = "loadtaro",
    LOAD_STRUCT = "loadstruct",
}

function loadMicroService() {
    ApplicationEvents.emit(Application.LOAD_MICROSERVICE)
}

function loadInterFace(args?: any[]) {
    if (args) {
        ApplicationEvents.emit(Application.LOAD_INTERFACE, args)
    } else {
        ApplicationEvents.emit(Application.REQUIRE_INTERFACE)
    }
}

export {
    Application,
    loadMicroService,
    loadInterFace,
    ApplicationEvents,
}