import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";


library.add(faPlusSquare)
library.add(faWindowClose)

export default {
    name: 'template_colors_list',
    components: {
        FontAwesomeIcon
    },
    props: ['renderer', 'active'],
    computed: mapState({
        colors: 'colors'
    }),
    methods: {
        setActive(index) {
            this.$store.commit('template_color_focus', index)
            this.$store.commit('select_panel', 'select_color')
        }
    }
}