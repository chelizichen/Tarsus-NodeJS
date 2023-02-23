declare class class_transformer {
    static plainToClass<T extends new () => void>(plain: Record<string, any>, Class: T): InstanceType<T>;
    static classToPlain<T>(ClassInstance: T, filterKey: Array<keyof T>): Record<string, string>;
    static __classToPlain__(get: string[], inst: any): Record<string, string>;
}
export { class_transformer };
