<template>
    <button @click="onSaveFile">Save to file</button>
</template>

<script>

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
                renderer.renderer.domElement.toBlob((blob) => resolve(blob))
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
            downloadBlob(model_config, "model_config.json")
            return new Promise((resolve, reject) => get_screenshot(this.renderer, resolve, reject))
                .then((blob) => downloadBlob(blob, "model_config.png"))
        }
    }
}
</script>