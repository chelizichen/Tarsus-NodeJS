class TarsusError extends Error {
    public err:string
    constructor(err:any) {
        super(err.message);
        this.err = err;
    }
}

const InterFaceError    = () => new TarsusError({ code: -1, message: 'error:接口异常' })
const OutTimeError      = () => new TarsusError({ code: -2, message: 'error:超时异常' })
const TouchError        = () => new TarsusError({ code: -3, message: 'error:创建文件异常' })
const MakeDirError      = () => new TarsusError({ code: -4, message: 'error:创建目录异常' })
const ResetError        = () => new TarsusError({ code: -5, message: 'error:重启服务异常' })
const DBResetError      = () => new TarsusError({ code: -6, message: 'error:重启数据库异常' })
const DBError           = () => new TarsusError({ code: -7, message: 'error:数据库异常' })
const CacheError        = () => new TarsusError({ code: -8, message: 'error:缓存异常' })
const LimitError        = () => new TarsusError({ code: -9, message: 'error:请求接口超出限制异常' })
const PipeError         = () => new TarsusError({ code: -10, message: 'error:管道验证失败' })
const InterceptorError  = () => new TarsusError({ code: -11, message: 'error:拦截器验证失败' })

export {
    InterFaceError      ,
    OutTimeError        ,
    TouchError          ,
    MakeDirError        ,
    ResetError          ,
    DBResetError        ,
    DBError             ,
    CacheError          ,
    LimitError          ,
    PipeError           ,
    InterceptorError    ,
}