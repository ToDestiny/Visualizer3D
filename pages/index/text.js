export default {
    name: 'general_configs',
    components: {},
    props: ['renderer'],
    computed: {
        text_name: {
            get() { return this.$store.state.text_name },
            set(value) {
                this.$store.dispatch("set_text_name", { renderer: this.renderer, text: value })
            }
        },
        text_number: {
            get() { return this.$store.state.text_number },
            set(value) {
                this.$store.dispatch("set_text_number", { renderer: this.renderer, text: value })
            }
        }
    },
    methods: {}
}