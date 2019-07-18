import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";


library.add(faPlusSquare)
library.add(faWindowClose)

export default {
    name: 'template-select',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer'],
    watch: {
        renderer(new_val, old_val) {
            this.updateTemplates(new_val)
        },
        selection(new_val, old_val) {
            this.setTemplate(new_val)
        }
    },
    data () {
        return {
            templates: [],
            selection: ""
        }
    },
    methods: {
        updateTemplates(new_renderer) {
            this.templates = this.renderer.getTemplates()
            console.log("logging updateTemplates")
            console.log(!this.selection)
            if (this.templates && !this.selection) {
                this.selection = this.templates[0]
                this.setTemplate(this.templates[0])
            }
        },
        setTemplate(selection) {
            // TODO update in renderer
        }
    },
    mounted () {
        // TO UPDATE EVERYTIME MODEL CHANGES
        if (this.renderer)
            this.updateTemplates(this.renderer)
    }
}