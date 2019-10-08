import { library } from "@fortawesome/fontawesome-svg-core";
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as JSZip from "jszip"
import axios from "axios"

library.add(faSave)

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
    function render_screenshot() {
        let canvas = document.createElement("canvas")
        canvas.width = 512
        canvas.height = 512
        let ctx = canvas.getContext("2d")
        ctx.drawImage(this.renderer.domElement, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95)
    }
    renderer.on("before:render", () => {
        renderer.resetCamera()
        renderer.on("after:render", render_screenshot, true)
    }, true)
}

function make_zip(renderer) {
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

export default {
    name: 'save',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer'],
    methods: {
        onSaveFile() {
            if (!this.$store.state.initialized)
                return
            return make_zip(this.renderer)
            .then((blob) => downloadBlob(blob, "model_config.zip"))
            .then(() => new Promise((resolve, reject) => get_screenshot(this.renderer, resolve, reject)))
            .then((blob) => {
                downloadBlob(blob, "preview.jpg")
            })
        },
        onUploadFile() {
            let upload_data = []
            let options = {
                'Authorization': `Bearer ${this.$store.state.user_token}`,
                'Content-Type': 'multipart/form-data'
            }
            upload_data.push(make_zip(this.renderer))
            upload_data.push(new Promise((resolve, reject) => get_screenshot(this.renderer, resolve, reject)))
            Promise.all(upload_data)
            .then(([zip, img]) => {
                let form_data = new FormData()
                form_data.append("zip", zip)
                return Promise.all([axios.post("https://dev-api.myth.gg/api/statics/editor/zip", form_data, options), img])
            })
            .then(([response, img]) => {
                let form_data = new FormData()
                form_data.append("preview", img)
                return axios.post("https://dev-api.myth.gg/api/statics/editor/preview", form_data, options)
            })
            .then((response) => console.log(response))
            .catch((error) => console.error(error))
        }
    }
}