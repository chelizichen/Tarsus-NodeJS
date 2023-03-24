import express, { Express } from "express";
import { TarsusEvent } from "../../microservice/application/TarsusEvent";

class TarsusOberserver {

  public static app: Express = undefined;

  static getApp() {
    if (!TarsusOberserver.app) {
      TarsusOberserver.app = express();
    }
    return TarsusOberserver.app;
  }

  public static router = express.Router();

  public static TarsusEvents: TarsusEvent = undefined;

  public static getEvents() {
    if (!TarsusOberserver.TarsusEvents) {
      TarsusOberserver.TarsusEvents = new TarsusEvent();
    }
    return TarsusOberserver.TarsusEvents;
  }

  public static TarsusStream = undefined;
  public static getStream() {
    if (!TarsusOberserver.TarsusStream) {
      const { TarsusStream } = require("tarsus-cli");
      TarsusOberserver.TarsusStream = TarsusStream;
    }
    return TarsusOberserver.TarsusStream;
  }
}

export { TarsusOberserver };
