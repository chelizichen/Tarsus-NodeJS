import yaml from 'yaml'
import {cwd} from 'process';
import path from 'path';
import {readFileSync} from 'fs';

// parse yaml
class YamlUtil {
    public ParseObj: Record<string, any> = {}

    constructor(file_path) {
        this.parseToObject(file_path)
    }

    parseToObject(file_path: string) {
        const yaml_file_path = path.resolve(cwd(), file_path);
        const read_to_str = readFileSync(yaml_file_path, 'utf-8')
        this.ParseObj = yaml.parse(read_to_str);
    }

    readServant() {
        const obj = this.ParseObj['servant'];
        const name = obj['name']
        return name;
    }
}

export {YamlUtil};