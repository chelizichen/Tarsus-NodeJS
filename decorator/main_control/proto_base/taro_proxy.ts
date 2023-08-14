const { TarsusStream } = require("tarsus-cli");

const stream_proxy = {
    TarsusStream,
    SetStream(url:string) {
        new stream_proxy.TarsusStream(url);
    },

    Parse(...args:any[]) {
        return stream_proxy.TarsusStream.parse(...args);
    },
    StreamMap:{}
}

export default stream_proxy