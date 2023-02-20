import path from "path";
function resolveViews(...args: string[]) {
  return path.resolve("public/views/", ...args);
}
export { resolveViews };
