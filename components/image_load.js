import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(faPlusSquare)
library.add(faWindowClose)

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default {
    name: 'image-load',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer'],
    watch: {
        renderer(new_val, old_val) {
            this.fixed_positions = this.renderer.getFixedPositions()
        }
    },
    data () {
        return {
            img_file: null,
            images: {},
            image_count: 0,
            fixed_positions: []
        }
    },
    methods: {
        onDrop (ev) {
            ev.preventDefault()
            this.addFiles(ev.dataTransfer.files)
        },
        onDragHandler (ev) {
            ev.preventDefault()
        },
        newTmpFile (ev) {
            this.addFiles(this.$refs.tmpFile.files)
        },
        clickOnTmpFile () {
            this.$refs.tmpFile.click()
        },
        addFiles (files) {
            let i = 0;
            for (let fl of files) {
                const uuid = uuidv4()
    
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.images[uuid] = {
                      file: fl,
                      data: e.target.result,
                      position: 0,
                      new_position: 0
                    }
                    this.renderer.addFixedLogo(
                      this.images[uuid].data,
                      uuid,
                      this.images[uuid].position
                    )
                    this.image_count = Object.keys(this.images).length
                };
                reader.readAsDataURL(fl);
            }
            this.$refs.tmpFile.value = ""
        },
        moveLogo (uuid) {
          this.images[uuid].position = this.images[uuid].new_position
          this.renderer.addFixedLogo(this.images[uuid].data,
            uuid,
            this.images[uuid].position)
        },
        deleteImage(uuid) {
          this.renderer.removeLogo(uuid)
          delete this.images[uuid]
          this.image_count = Object.keys(this.images).length
        }
    }
}