import { RequestFactory } from "../../../decorator/web/proxy/http";

const NodeProxy = RequestFactory(10012,"http://127.0.0.1")

export default NodeProxy