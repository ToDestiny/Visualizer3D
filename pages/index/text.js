import { mapState } from "vuex";

export default {
    name: 'general_configs',
    components: {},
    props: ['renderer'],
    data() {
        return {
            color_table: [
                [
                    '#ffffff',
                    '#000000',
                    '#ff0000',
                    '#0000ff',
                ],
            ]
        }
    },
    computed: {
        ...mapState({
            name: (state) => state.text_slots["name"] ?
                state.text_slots["name"] : { text: "", color: null },
            number: (state) => state.text_slots["number"] ?
                state.text_slots["number"] : { text: "", color: null }
        }),
        name_text: {
            get() { return this.name.text },
            set(value) {
                this.$store.dispatch("set_text", {
                    renderer: this.renderer,
                    text: value,
                    color: this.name.color, // TODO select color
                    slot: "name"
                })
            }
        },
        name_color: {
            get() { return this.name.color },
            set(value) {
                this.$store.dispatch("set_text", {
                    renderer: this.renderer,
                    text: this.name.text,
                    color: value, // TODO select color
                    slot: "name"
                })
            }
        },
        number_text: {
            get() { return this.number.text },
            set(value) {
                this.$store.dispatch("set_text", {
                    renderer: this.renderer,
                    text: value,
                    color: this.number.color, // TODO select color
                    slot: "number"
                })
            }
        },
        number_color: {
            get() { return this.number.color },
            set(value) {
                this.$store.dispatch("set_text", {
                    renderer: this.renderer,
                    text: this.number.text,
                    color: value, // TODO select color
                    slot: "number"
                })
            }
        }
    },
    methods: {}
}