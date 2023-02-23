/**
 * @description
 * typescript 5.0.0 暂不支持 ParamterDecorator
 */
declare function Query(): (value: any, context: any) => void;
declare function Body(): void;
export { Body, Query };
