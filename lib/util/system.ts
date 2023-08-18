import {exec} from "child_process";
import os from "os";

/**
 * @description 系统工具类
 * @method GetPidFromPort 根据端口获取对应的PID 仅限NodeJS
 */
class SystemUtils {
    static GetPidFromPort(port: number) {
        if (os.platform() == "linux") {
            return new Promise((resolve, reject) => {
                const cmd = "lsof -i:" + port + "| awk 'NR==2{print $2}' ";
                const kill_process = exec(cmd);
                kill_process.stdout?.on("data", function (chunk) {
                    const pid: number = chunk.toString();
                    if (pid && !isNaN(pid)) {
                        resolve(pid);
                    }
                    reject(false);
                });
            });
        } else if (os.platform() === "win32") {
            return new Promise((resolve, reject) => {
                const cmd = `netstat -ano | findstr :${port}`;
                const find_process = exec(cmd);
                find_process.stdout?.on("data", function (chunk) {
                    const lines = chunk.toString().split("\n");
                    const processes = lines.filter((line) => line.trim() !== "");
                    if (processes.length > 0) {
                        const pid = processes[0].split(/\s+/)[4];
                        if (pid && !isNaN(pid)) {
                            resolve(parseInt(pid));
                        }
                    }
                    reject(false);
                });
            });
        }
    }

    static filterPorts(ports: number[]) {

    }
}

export {SystemUtils};
