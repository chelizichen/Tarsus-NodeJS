/**
 * @author chelizichen
 * @description @Ado/Rpc/Event 提供注册和调用方法
 *
 */



class Interface_Events {
    events: Record<string, (...args: any[]) => Promise<any>>;

    static get_fn_name(interFace: string, method: string) {
        let fn_name = "[#1]" + interFace + "[#2]" + method;
        return fn_name
    }

    constructor() {
        this.events = {};
    }

    /**
     * @description 注册远程方法
     * @param Head -> Buffer
     * @param CallBack -> Function
     */
    register(Head: string, CallBack: (...args: any[]) => Promise<any>) {
        this.events[Head] = CallBack;
    }

    /**
     * @method emit
     * @description 调用远程方法
     */

    async emit(Head: Buffer, ...args: any[]) {
        let head = Head.toString();
        return await this.events[head](...args);
    }

}

export default Interface_Events;