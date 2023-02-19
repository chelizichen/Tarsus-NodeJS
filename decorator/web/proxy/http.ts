import axios, { AxiosRequestConfig } from "axios";

function createkey(port: number, host: string) {
    return `-h ${host} -p ${port}`;
  }

function RequestFactory(port:number,host:string){
    const proxy_request = axios.create({
        timeout: 6000,
        headers: { "Content-Type": "application/json;charset=utf-8" },
        // 接口代理地址
        baseURL: "http://localhost:5005/api/proxy/interceptor",
        method: "post",
    });
    proxy_request.interceptors.request.use((config: any) => {
          if (!config.headers) {
            throw new Error(
              `Expected 'config' and 'config.headers' not to be undefined`
            );
          }
          config.data.key = createkey(port,host)
          if(!config.data.timeout){
            config.data.timeout = "3000"
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
    );
    
    return proxy_request
}


export {
    RequestFactory
}