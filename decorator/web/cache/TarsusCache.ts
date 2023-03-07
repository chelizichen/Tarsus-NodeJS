import redis, { RedisClientType } from 'redis'
import { Collect } from '../../ioc';
import path from 'path';
import { cwd } from 'process';

@Collect
class TarsusCache {
  RedisTemplate: RedisClientType
  config: Record<string, any>;
  constructor() {
    this.RedisTemplate = redis.createClient();
    
  }

  public async  getMsServer() {
    const data = await this.RedisTemplate.SMEMBERS("")
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    const config = require(config_path);
  }
}

export {
  TarsusCache
}