declare const interFaceMap: Map<string, Function>;
declare const interFaceSet: Set<{
    func: any;
    method_name: string;
}>;
declare const TarsusMethod: (value: any, context: ClassMethodDecoratorContext) => void;
declare const TarsusInterFace: (interFace: string) => (classValue: any, context: ClassDecoratorContext) => void;
export { interFaceMap, interFaceSet, TarsusInterFace, TarsusMethod };
