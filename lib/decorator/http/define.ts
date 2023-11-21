function setName(key,contextName){
    return `${key}|${contextName}`
}

const RxConstant = {
    __rx__method__jwt__:"__rx__method__jwt__",
    __rx__controller__jwt__:"__rx__controller__jwt__",
    __rx__interceptor__:"__rx__interceptor__",
    __rx__pipe__:"__rx__pipe__",
    __rx__router__:"__rx__router__",
    __rx__resp__:"__rx__resp__",
    __request__:"__request__",
    __response__:"__response__"

}
export {
    setName,
    RxConstant
}