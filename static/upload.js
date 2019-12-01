import { make_zip } from './ziptoconfig'
import axios from "axios"

export function downloadBlob(blob, filename) {
    let el = document.createElement("a")
    document.body.appendChild(el)
    el.style = "display: none"
    let url = window.URL.createObjectURL(blob)
    el.href = url
    el.download = filename
    el.click()
    window.URL.revokeObjectURL(url)
}

export function get_screenshot(renderer, resolve, reject) {
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

export async function upload_file(renderer, q_cid) {
    let upload_options = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    let zip_data = await make_zip(renderer)
    let img_data = await new Promise((resolve, reject) => get_screenshot(renderer, resolve, reject))
    try {
        let access_token = await axios.get(`https://api.myth.gg/api/guest/access/upload?cid=${q_cid}`)
            .then((response) => response['accessToken'])
        let zip_form_data = new FormData()
        zip_form_data.append("zip", zip_data)
        await axios.post(`https://api-storage.myth.gg/file?usage=editor&folder=${q_cid}&token=${access_token}`, zip_form_data, upload_options)
        let img_form_data = new FormData()
        img_form_data.append("preview", img_data)
        await axios.post(`https://api-storage.myth.gg/file/image?usage=editor&folder=${q_cid}&token=${access_token}`, img_form_data, upload_options)
    }
    catch (error) {
        console.error(error)
    }
    redirect(q_cid)
}

export function link_or_redirect(q_cid) {
    let token_name = 'token'
    let reg = new RegExp('^(?:.*;)?\s*' + token_name + '\s*=\s*([^;]+)(?:.*)?$')
    // if cookie "token" is present
    if (document.cookie.match(reg))
        window.location.assign("https://board.myth.gg/dashboard")
    else
        window.location.assign(`https://board.myth.gg/register?cid=${q_cid}`)
}