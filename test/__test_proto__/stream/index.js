// T_WStream T_RStream:  serialize and deserialize utils
// compatible   with nodes and browsers
// created by   chelizichen
var T_WStream = /** @class */ (function () {
    function T_WStream() {
        this.position = 0;
        this._capacity = 0;
        this.positionMap = new Map();
        this._capacity = 0;
        this.createBuffer(this._capacity);
        this.originView = new DataView(this.originBuf.buffer);
    }
    T_WStream.prototype.createBuffer = function (size) {
        return Buffer.alloc(size);
    };
    T_WStream.prototype.allocate = function (byteLength) {
        if (this._capacity > this.position + byteLength) {
            return;
        }
        this._capacity = Math.max(512, (this.position + byteLength) * 2);
        var tempBuf = this.createBuffer(this._capacity);
        if (this.originBuf != null) {
            this.originBuf.copy(tempBuf, 0, 0, this.position);
            this.originBuf = undefined;
            this.originView = undefined;
        }
        this.originBuf = tempBuf;
        this.originView = new DataView(this.originBuf.buffer);
    };
    T_WStream.prototype.WriteInt8 = function (tag, value) {
        this.position += 1;
        this.allocate(1);
        this.positionMap.set(tag, this.position);
        this.originView.setInt8(this.position, value);
    };
    T_WStream.prototype.WriteInt16 = function (tag, value) {
        this.position += 2;
        this.allocate(2);
        this.positionMap.set(tag, this.position);
        this.originView.setInt16(tag, value);
    };
    T_WStream.prototype.WriteInt32 = function (tag, value) {
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag, this.position);
        this.originView.setInt32(tag, value);
    };
    T_WStream.prototype.WriteInt64 = function (tag, value) {
        this.position += 8;
        this.allocate(8);
        this.positionMap.set(tag, this.position);
        this.originView.setBigInt64(tag, value);
    };
    T_WStream.prototype.WriteString = function (tag, value) {
        var encoded = new TextEncoder().encode(value);
        for (var i = 0; i < encoded.length; i++) {
            this.originView.setInt8(tag + i, encoded[i]);
        }
    };
    return T_WStream;
}());
var T_RStream = /** @class */ (function () {
    function T_RStream(buf) {
        this.position = 0;
        this.originView = new DataView(buf.buffer);
    }
    T_RStream.prototype.ReadInt8 = function (tag) {
        this.position += 1;
        return this.originView.getInt8(this.position - 1);
    };
    T_RStream.prototype.ReadInt16 = function (tag) {
        this.position += 2;
        return this.originView.getInt16(this.position - 2);
    };
    T_RStream.prototype.ReadInt32 = function (tag) {
        this.position += 4;
        return this.originView.getInt32(this.position - 4);
    };
    T_RStream.prototype.ReadInt64 = function (tag) {
        this.position += 8;
        return this.originView.getBigInt64(this.position - 8);
    };
    return T_RStream;
}());
function main() {
    var ws = new T_WStream();
    ws.WriteInt8(0, 11);
    ws.WriteInt16(1, 22);
    ws.WriteInt32(2, 33);
    ws.WriteInt8(3, 44);
    var buf = ws.originBuf;
    var rs = new T_RStream(buf);
    var a = rs.ReadInt8(0);
    var b = rs.ReadInt16(1);
    var c = rs.ReadInt32(2);
    var d = rs.ReadInt64(3);
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);
}
main();
