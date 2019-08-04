import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";

export default {
    name: 'select-color',
    components: {},
    props: ['renderer', 'active'],
    data() {
        return {
            color_table: [
                '#ff0',
                '#0ff'
            ]
        }
    },
    computed: {
        ...mapState({
            focus: (state) => state.template_color_focus
        }),
        color_selection: {
            get() { return this.colors ? this.colors[focus] : null },
            set(value) {
                this.$store.dispatch('set_color', { renderer: this.renderer, index: this.focus, color: value })
            }
        },
    }
}