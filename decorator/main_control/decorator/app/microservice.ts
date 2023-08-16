import load_ms_app from "../../load_server/load_ms_app";

const TarsusMsApplication = (value, context) => {
    context.addInitializer(() => {
        load_ms_app.init()
    })
}

export default TarsusMsApplication