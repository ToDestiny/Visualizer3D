export default {
    name: 'general_configs',
    components: {},
    props: ['renderer'],
    computed: {
        text_name: {
            get() { return this.$store.state.text_slots["name"] },
            set(value) {
                this.$store.dispatch("set_text", { renderer: this.renderer, text: value, slot: "name" })
            }
        },
        text_number: {
            get() { return this.$store.state.text_slots["number"] },
            set(value) {
                this.$store.dispatch("set_text", { renderer: this.renderer, text: value, slot: "number" })
            }
        }
    },
    methods: {}
}