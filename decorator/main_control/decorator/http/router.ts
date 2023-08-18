import load_web_app from "../../load_server/load_web_app";

export enum METHODS {
    GET = "get",
    POST = "post",
    INVOKE = "all",
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

                if(type === METHODS.INVOKE){
                    router[type](current_route, async (req, res) => {
                        func(req,res);
                    });
                }
                else {
                    router[type](current_route, async (req, res) => {
                        const data = await func(req);
                        if (!res.destroyed) {
                            res.json(data);
                        }
                    });
                }
            });
        };
    };
}

const Get = methods_factory(METHODS.GET)
const Post = methods_factory(METHODS.POST)

const INVOKE = methods_factory(METHODS.INVOKE)

const Controller = (interFace: string) => {
    return function (controller: new () => any, context: ClassDecoratorContext) {
        controller.prototype.interFace = interFace;
    };
};


export {Get, Post, INVOKE, Controller};
