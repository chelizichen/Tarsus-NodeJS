import { ArcOrm } from "./ArcOrm"

function getConenction(){
    return ArcOrm.getConnection()
}

export {
    getConenction
}