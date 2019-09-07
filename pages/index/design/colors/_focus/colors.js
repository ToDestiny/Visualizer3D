import { mapState } from "vuex";

export default {
    name: 'select-color',
    components: {},
    props: ['renderer'],
    data() {
        return {
            color_table: [
                // TODO literally the same as you know who. switch it up?
                '#ffffff',
                '#000000',
                '#fff692',
                '#ffd146',
                '#e9a837',
                '#ffc867',
                '#ff7b3c',
                '#da4133',
                '#842227',
                '#ffb6a0',
                '#ff343d',
                '#842227',
                '#ffa096',
                '#ff343d',
                '#ffa3aa',
                '#fa0057',
                '#861344',
                '#deb6d4',
                '#c65994',
                '#74375a',
                '#c1b0ce',
                '#685090',
                '#4e2e58',
                '#bdcacc',
                '#508194',
                '#242d38',
                '#a0c4d2',
                '#255584',
                '#273246',
                '#8acad8',
                '#007fb7',
                '#26475b',
                '#120e5d',
                '#3c0c41',
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