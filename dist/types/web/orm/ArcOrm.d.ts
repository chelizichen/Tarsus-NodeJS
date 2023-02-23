import * as mysql from "mysql";
declare class ArcOrm {
    static getConnection(): void;
    static ConnectionPool: mysql.Pool;
    static CreatePool(config: any): void;
    static query(prepareSqlAndArgs: any, Class: any): Promise<any>;
    getList(): void;
}
export { ArcOrm };
