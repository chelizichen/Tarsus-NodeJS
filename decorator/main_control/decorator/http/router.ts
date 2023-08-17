import load_web_app from "../../load_server/load_web_app";

export enum METHODS {
    GET = "get",
    POST = "post",
    REMOTE = "all",
}

function create_url(interFace: string, method: string): string {
    if (!interFace.startsWith("/")) {
        interFace = "/" + interFace;
    }
    if (!method.startsWith("/")) {
        method = "/" + method
    }
    return interFace + method;
}

function methods_factory(type: METHODS) {
    return function (url: string) {
        let router = load_web_app.router;
        return (func: any, context: ClassMethodDecoratorContext) => {
            context.addInitializer(function () {

                // @ts-ignore
                let current_route = create_url(this.interFace, url);

                func = func.bind(this);

                router[type](current_route, async (req, res) => {
                    console.log("执行前")
                    const data = await func(req);
                    console.log("执行后")
                    if (!res.destroyed) {
                        res.json(data);
                    }
                });
            });
        };
    };
}

const Get = methods_factory(METHODS.GET)
const Post = methods_factory(METHODS.POST)

const Remote = methods_factory(METHODS.REMOTE)

const Controller = (interFace: string) => {
    return function (controller: new () => any, context: ClassDecoratorContext) {
        controller.prototype.interFace = interFace;
    };
};


export {Get, Post, Remote, Controller};