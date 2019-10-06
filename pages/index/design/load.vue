<template>
    <div class="px-2 py-2 d-flex flex-column justify-content-center align-items-center" style="height: 400px" id="dz" @drop="onDrop" @dragover="onDragHandler">
        <font-awesome-icon style="font-size: 4em;" icon="upload" @click="clickOnTmpFile"/>
        <p>Upload your model configuration</p>
        <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" />
    </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as JSZip from "jszip"

library.add(faUpload)

export default {
    name: 'save',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer'],
    methods: {
        load_config(files) {
            let file = files[0]
            let reader = new FileReader()
            reader.onload = (e) => {
                let zip = new JSZip()
                zip.loadAsync(e.target.result)
                    .then((zip) => zip.file("model_config.json").async("string"))
                    .then((config) => {
                        let model = JSON.parse(config)
                        this.$store.dispatch("load_config", { renderer: this.renderer, model })
                    })
            }
            reader.readAsBinaryString(file)
        },
        onDrop (ev) {
            ev.preventDefault()
            this.load_config(ev.dataTransfer.files)
        },
        onDragHandler(ev) {
            ev.preventDefault()
        },
        clickOnTmpFile() {
            this.$refs.tmpFile.click()
        },
        newTmpFile(ev) {
            this.load_config(this.$refs.tmpFile.files)
            this.$refs.tmpFile.value = ""
        },
    }
}
</script>