import { TarsusOberserver } from "../../web/ober/TarsusOberserver"

class TarsusStreamProxy{
  static TarsusStream = TarsusOberserver.getStream()
  
  static SetStream(url:string) {
    new TarsusStreamProxy.TarsusStream(url);
  }

  static Parse(...args:any[]) {
    return TarsusStreamProxy.TarsusStream.parse(...args);
  }
}

export {
  TarsusStreamProxy
}