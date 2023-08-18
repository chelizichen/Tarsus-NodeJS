const { TarsusStream,TarsusReadStream } = require("tarsus-cli/taro");

const stream_proxy = {
    TarsusStream,
    TarsusReadStream,
    SetStream(url:string) {
        new TarsusStream(url);
    },

    Parse(...args:any[]) {
        return TarsusStream.parse(...args);
    },
    StreamMap:{}
}

export default stream_proxy