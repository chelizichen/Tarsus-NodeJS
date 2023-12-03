/**
 * @desc
 * 为Buffer 写入4位大小的值
 */
export function $WriteHead(taget:Buffer){
    const bytes = taget.byteLength;
    const head = Buffer.alloc(bytes + 4)
    head.writeInt32BE(bytes,0)
    taget.copy(head,4)
    return head;
}

