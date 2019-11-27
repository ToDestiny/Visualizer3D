import { library } from "@fortawesome/fontawesome-svg-core";
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { make_zip } from '../../static/ziptoconfig'
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
        async onUploadFile() {
            let options = {
                withCredentials: true,
                headers: {
                    //'Authorization': `Bearer ${this.$store.state.user_token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
            let zip = await make_zip(this.renderer)
            let img = await new Promise((resolve, reject) => get_screenshot(this.renderer, resolve, reject))
            try {
                let zip_form_data = new FormData()
                zip_form_data.append("zip", zip)
                let zip_response = await axios.post("https://dev-api.myth.gg/statics/editor/zip", zip_form_data, options)
                console.log(zip_response)
                let img_form_data = new FormData()
                img_form_data.append("preview", img)
                let img_response = await axios.post(`https://dev-api.myth.gg/statics/editor/${zip_response.data._id}/preview`, img_form_data, options)
                console.log(img_response)
                window.location.replace("https://board.myth.gg/dashboard")
            }
            catch (error) {
                console.error(error)
            }
        }
    }
}