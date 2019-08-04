import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";
import Renderer from "./renderer/renderer";


library.add(faPlusSquare)
library.add(faWindowClose)

export default {
    name: 'image-load',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer', 'active'],
    computed: {
        ...mapState({
            positions: (state) => (state.initialized) ? Renderer.getPositions(state.model) : null,
            logos_count: (state) => Object.keys(state.logos).length,
            logos: 'logos'
        })
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
                      file: fl,
                      data: e.target.result,
                      position: 0
                    }
                    this.$store.dispatch('set_logo', { renderer: this.renderer, logo: new_image, position: 0 })
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
}