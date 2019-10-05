<template>
    <div class="px-3 py-3 d-flex flex-column justify-content-center align-items-center" id="dz" @drop="onDrop" @dragover="onDragHandler">
        <font-awesome-icon style="font-size: 4em;" icon="upload" @click="clickOnTmpFile"/>
        <p>Upload your model configuration</p>
        <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" />
    </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


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
            console.log(file)
            let reader = new FileReader()
            reader.onload = (e) => {
                console.log(e.target.result)
                let model = JSON.parse(e.target.result)
                this.$store.dispatch("load_config", { renderer: this.renderer, model })
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