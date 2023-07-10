import express, { Express } from "express";
import { TarsusEvent } from "../../microservice/application/TarsusEvent";


const { TarsusStream } = require("tarsus-cli");

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

  public static getStream() {
    return TarsusStream;
  }

  public static StreamMap: Record<string, { request: string, response: string }> = {}
}

export { TarsusOberserver };
