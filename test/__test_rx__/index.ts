import _ from "lodash";
import { from,throwError } from "rxjs";
import { catchError, concatMap, scan, takeWhile } from "rxjs/operators";

const handleObserve = from(["interceptor", "pipe", "router", "error","done"]);

const stream = handleObserve.pipe(
    concatMap(async (value) => {
        console.log('value',value);
        if(value == 'error'){
            throw new Error('test-error')
        }
        const result = await getAndSet(value);
        return result
    }),
    takeWhile(result => !(_.isError(result))),
    scan((accumulator, currentValue) => [...accumulator, currentValue], []), // 使用 scan 累积结果
    catchError(error => {
        return throwError(()=>{
            return error
        });
    })
);

stream.subscribe({
    next(v){
        console.log('next',v);
    },
    // error 直接退出，否则走完
    error(e){
        console.log('subscribe - error',e);
    },
    complete(){
        console.log('done');
    }
});

async function getAndSet(value) {
  // 模拟异步操作
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, 50);
  });
}
