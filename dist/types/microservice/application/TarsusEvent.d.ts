/**
 * @author chelizichen
 * @description @Ado/Rpc/Event 提供注册和调用方法
 *
 */
/// <reference types="node" />
declare class TarsusEvent {
    events: Record<string, (...args: any[]) => Promise<any>>;
    static get_fn_name(interFace: string, method: string): string;
    constructor();
    /**
     * @description 注册远程方法
     * @param Head -> Buffer
     * @param CallBack -> Function
     */
    register(Head: string, CallBack: (...args: any[]) => Promise<any>): void;
    /**
     * @method emit
     * @description 调用远程方法
     */
    emit(Head: Buffer, ...args: any[]): Promise<any>;
}
export { TarsusEvent };
