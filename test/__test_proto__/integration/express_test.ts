import express from "express";
import { LoadAmpleProxy } from "../bin/ample";
import { LoadSampleProxy } from "../bin/Sample";
import T_GateWay from "../gateway/T_GateWay";
import { useTarsusGateway } from "./express";

const AmpleProxy = {
  Module: LoadAmpleProxy.module,
  Conn: {
    port: 24001,
  },
  ClientProxy: LoadAmpleProxy,
};

// JavaServer
// const SampleProxy = {
//   Module: LoadSampleProxy.module,
//   Conn: {
//     port: 24511,
//   },
//   ClientProxy: LoadSampleProxy,
// };

const Servers = [AmpleProxy];
// const Servers = [SampleProxy, AmpleProxy];

const GateWay = new T_GateWay(Servers);

const app = express();
const tarsusGateway = useTarsusGateway(GateWay, express.Router());

app.use(express.json());
app.use("/api", tarsusGateway);

app.listen(3881, () => {
  console.log("server started at localhost:3881");
});
