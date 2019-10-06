import { mapState } from "vuex";

export default {
    name: 'select-color',
    components: {},
    props: ['renderer'],
    watch: {
        custom_color(new_val, old_val) {
            if (this.color_selection == old_val) {
                this.color_selection = new_val
            }
        }
    },
    data() {
        return {
            color_table: [
                ['#ffffff', '#000000'],
                ['#ff9900', '#725222', '#8e6322', '#aa721e', '#c68017', '#e58e0b'], ['#e7ff00', '#6b7222', '#848e22', '#9eaa1e', '#b6c617', '#d1e50b'], ['#6aff00', '#447222', '#4f8e22', '#59aa1e', '#61c617', '#66e50b'], ['#00ff12', '#227228', '#228e2a', '#1eaa28', '#17c624', '#0be51b'], ['#00ff8f', '#22724f', '#228e5f', '#1eaa6d', '#17c67a', '#0be586'], ['#00f1ff', '#226e72', '#22888e', '#1ea3aa', '#17bdc6', '#0bd9e5'], ['#0073ff', '#224672', '#22538e', '#1e5eaa', '#1767c6', '#0b6ee5'], ['#0900ff', '#252272', '#26228e', '#231eaa', '#1e17c6', '#130be5'], ['#8600ff', '#4c2272', '#5b228e', '#681eaa', '#7417c6', '#7e0be5'], ['#ff00fa', '#722271', '#8e228c', '#aa1ea8', '#c617c3', '#e50be1'], ['#ff007d', '#722249', '#8e2257', '#aa1e63', '#c6176d', '#e50b76'], ['#ff0000', '#722222', '#8e2222', '#aa1e1e', '#c61717', '#e50b0b']
            ]
        }
    },
    computed: {
        ...mapState({
            colors: (state) => state.colors
        }),
        focus() {
            return this.$route.params.focus
        },
        color_selection: {
            get() {
                return this.colors ? this.colors[this.focus] : null
            },
            set(value) {
                this.$store.dispatch('set_color', { renderer: this.renderer, index: this.focus, color: value })
            }
        },
    },
    validate ({ params }) {
        // TODO check it's a valid index
        return (/^\d+$/.test(params.focus))
    }
}