import axios, { AxiosInstance } from "axios";
import load_config, { config_enum } from "../load_config/load_config";
import { ServantUtil, parseToObj } from "../../util/servant";

let httpproxy =void 'axios request';

// setImmediate(() => {
    // 此处必须填写对应的 servant 地址
    const proxy_config = load_config.get_config(config_enum.proxy)
    const parse_config: parseToObj = ServantUtil.parse(proxy_config);

    httpproxy = axios.create({
        baseURL: parse_config.host,
        timeout: 50000,
        headers: { "Content-Type": "application/json;charset=utf-8" },
    });
// })

export default httpproxy

