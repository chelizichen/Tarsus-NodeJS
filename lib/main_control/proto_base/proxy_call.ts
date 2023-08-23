import axios from "axios";
import load_config, { config_enum } from "../load_config/load_config";

let httpproxy =void 'axios request';

// setImmediate(() => {
    // 此处必须填写对应的 servant的网关 地址
    const proxy_url = load_config.get_config(config_enum.proxy)
    httpproxy = axios.create({
        baseURL: proxy_url,
        timeout: 50000,
        headers: { "Content-Type": "application/json;charset=utf-8" },
    });
// })

export default httpproxy

