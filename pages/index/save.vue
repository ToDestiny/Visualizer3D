<template>
    <button @click="onSaveFile">Save to file</button>
</template>

<script>
import * as JSZip from "jszip"

function downloadBlob(blob, filename) {
    let el = document.createElement("a")
    document.body.appendChild(el)
    el.style = "display: none"
    let url = window.URL.createObjectURL(blob)
    el.href = url
    el.download = filename
    el.click()
    window.URL.revokeObjectURL(url)
}

function get_screenshot(renderer, resolve, reject) {
    renderer.on("before:render", () => {
        renderer.resetCamera()
        renderer.on("after:render",
            () => {
                renderer.renderer.domElement.toBlob((blob) => resolve(blob), "image/jpeg", 0.95)
            },
            true)
    }, true)
}

export default {
    name: 'save',
    components: {},
    props: ['renderer'],
    methods: {
        onSaveFile() {
            if (!this.$store.state.initialized)
                return
            let model_config = JSON.stringify(this.renderer.getConfig())
            model_config = new Blob([model_config])
            let zip = new JSZip()
            zip.file("model_config.json", model_config)
            zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            }).then((blob) => downloadBlob(blob, "model_config.zip"))
            return new Promise((resolve, reject) => get_screenshot(this.renderer, resolve, reject))
                /* .then((img) => {
                    let zip = JSZip()
                    zip.file("thumb.jpg", img)
                    return zip.generateAsync({ type: "blob" })
                }) */
                .then((blob) => downloadBlob(blob, "thumb.jpg"))
        }
    }
}
</script>