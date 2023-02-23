declare let EntityMap: Map<string, Map<string, string>>;
declare const Entity: (table: string) => (value: new () => void, context: ClassDecoratorContext) => void;
declare const Column: (field?: string | any, context?: ClassFieldDecoratorContext) => any;
export { Entity, Column, EntityMap };
