import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose, faTintSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Renderer from "static/renderer/renderer.js";


library.add(faPlusSquare)
library.add(faWindowClose)

export default {
    name: 'image-load',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer'],
    computed: {
        logos() {
            let filter_positions = this.positions
            return Object.values(this.$store.state.logos)
                .filter(({ position }) => filter_positions.some(({ index }) => index == position))
        },
        positions() {
            if (!this.$store.state.initialized)
                return null
            return Renderer.getPositions(this.$store.state.model)
                .map((position, index) => ({...position, index}))
                .filter(({ part }) => part == this.part_name)
        },
        logos_count() {
            return this.logos ? Object.keys(this.logos).length : 0
        },
        part_name() {
            return this.$route.params.part_name
        }
    },
    methods: {
        onDrop (ev) {
            ev.preventDefault()
            this.addFiles(ev.dataTransfer.files)
        },
        onDragHandler(ev) {
            ev.preventDefault()
        },
        clickOnTmpFile() {
            this.$refs.tmpFile.click()
        },
        newTmpFile(ev) {
            this.addFiles(this.$refs.tmpFile.files)
            this.$refs.tmpFile.value = ""
        },
        addFiles (files) {
            for (let fl of files) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let new_image = {
                      data: e.target.result,
                    }
                    this.$store.dispatch('set_logo', { renderer: this.renderer, logo: new_image, position: this.positions[0].index })
                };
                reader.readAsDataURL(fl);
            }
        },
        moveLogo (image, position) {
            this.$store.dispatch('set_logo', { renderer: this.renderer, logo: image, position })
        },
        deleteImage(image) {
            this.$store.dispatch('remove_logo', { renderer: this.renderer, logo: image })
        }
    }
    // TODO validate part name
}