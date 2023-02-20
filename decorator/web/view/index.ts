import { routers } from "../controller/routers"
import { METHODS } from "../method"



const View = (url:string)=>{
    return function(value,context){
        routers.set({ url, method: METHODS.VIEW }, value)
    }
}

export {
    View,
}