import * as JSZip from "jszip"

export function make_zip(renderer) {
    let model_config = JSON.stringify(renderer.getConfig())
    model_config = new Blob([model_config])
    let zip = new JSZip()
    zip.file("model_config.json", model_config)
    return zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        ompressionOptions: {
            level: 9
        }
    })
}

export function load_zipped(store, renderer, data) {
    let zip = new JSZip()
    return zip.loadAsync(data)
        .then((zip) => zip.file("model_config.json").async("string"))
        .then((config) => {
            let model = JSON.parse(config)
            store.dispatch("load_config", { renderer, model })
    })
}