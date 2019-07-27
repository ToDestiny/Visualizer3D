import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";


library.add(faPlusSquare)
library.add(faWindowClose)

export default {
    name: 'template-select',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer'],
    computed: {
        template_selection: {
            get() { return this.$store.state.template_selection },
            set(value) {
                this.$store.dispatch('set_template', { renderer: this.renderer, index: value })
            }
        },
        templates: {
            get() {
                if (this.$store.state.model) {
                    return this.$store.state.model.templates
                }
                return null
            }
        }
    }
}