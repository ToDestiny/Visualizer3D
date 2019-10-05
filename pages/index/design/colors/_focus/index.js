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
                ['#b27211', '#c2801d', '#d28f2a', '#e29e38', '#f2960c'],
                ['#92b211', '#a1c21d', '#b0d22a', '#c0e238', '#c4f20c'],
                ['#31b211', '#3ec21d', '#4bd22a', '#5ae238', '#3af20c'],
                ['#11b252', '#1dc25f', '#2ad26d', '#38e27c', '#0cf268'],
                ['#11b2b2', '#1dc2c2', '#2ad2d2', '#38e2e2', '#0cf2f2'],
                ['#1152b2', '#1d5fc2', '#2a6dd2', '#387ce2', '#0c68f2'],
                ['#3111b2', '#3e1dc2', '#4b2ad2', '#5a38e2', '#3a0cf2'],
                ['#9211b2', '#a11dc2', '#b02ad2', '#c038e2', '#c40cf2'],
                ['#b21172', '#c21d80', '#d22a8f', '#e2389e', '#f20c96'],
                ['#b21111', '#c21d1d', '#d22a2a', '#e23838', '#f20c0c']
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