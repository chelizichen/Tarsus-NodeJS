import { TarsusOrm } from "./TarsusOrm"

function getConenction(){
    return TarsusOrm.getConnection();
}

export {
    getConenction
}