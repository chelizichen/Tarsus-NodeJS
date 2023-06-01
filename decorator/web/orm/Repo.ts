import { TarsusEntitys } from "./Entity";

type Pagination = {
  offset: string;
  keyword: string;
  size: string;
  page: string;
};

type OrmMethods<T> = {
  getList(pagination?: Pagination): Array<T>;
  findOne(): T;
  delOne(): void;
  save(entity: T): void;
  update(entity: T): void;
  query(...args: any[]): any;
};

type Repository<T> = OrmMethods<T> & T;

function Repo(Entity: new (...args: any[]) => any) {
  return function (value: any, context: ClassFieldDecoratorContext) {
    return function () {
      return TarsusEntitys[Entity.prototype.__table__];
    };
  };
}

export { Repository, Repo };
