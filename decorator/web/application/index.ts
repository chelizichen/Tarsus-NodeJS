import { ArcServer } from "./ArcServer";
import {EventEmitter} from 'node:events'

const ApplicationEvents = new EventEmitter();

enum Application{
    LOAD_SERVER="loadserver"
}

export { ArcServer,ApplicationEvents,Application };