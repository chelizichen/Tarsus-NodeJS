import express, { Express } from 'express';


class TarsusOberserver{
  
  public static app: Express = undefined;

  static getApp() {
    if (!TarsusOberserver.app) {
      TarsusOberserver.app = express();
    }
    return TarsusOberserver.app;
  }

  public static router = express.Router()
}

export {
  TarsusOberserver
}