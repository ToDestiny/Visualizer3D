import { library } from "@fortawesome/fontawesome-svg-core";
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { downloadBlob, get_screenshot, upload_file } from '../../static/upload'

library.add(faSave)

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
            await upload_file(this.renderer, this.$store.state.cid)
        },
    }
}