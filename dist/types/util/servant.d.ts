export type parseToObj = {
    language: "java" | "node";
    proto: "ms" | "http";
    host: string;
    port: string;
    serverName: string;
};
declare class ServantUtil {
    static params: {
        key: string;
        param: string;
    }[];
    static parse(servant: string): parseToObj;
}
export { ServantUtil };
