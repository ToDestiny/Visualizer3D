import Renderer from 'static/renderer/renderer.js'
import axios from 'axios'
import { mapState } from 'vuex';

export default {
    name: 'App',
    data () {
        return {
            renderer: null,
            renderer_height: 0
        }
    },
    methods: {
        route_matches(path) {
            return this.$route.matched.some(({ regex }) => regex.test(path))
        },
        on_resize() {
            this.renderer.resetSize()
        }
    },
    computed: {
        ...mapState({
            colors: (state) => state.colors,
            model: (state) => state.model,
        }),
        logo_parts() {
            return this.model.parts.filter(({ name }) => 
                this.model.logos.some(({part}) => name === part)
            )
        }
    },
    mounted() {
        this.renderer = new Renderer(this.$refs.rendererContainer)
        let payload = { renderer: this.renderer, model_url: '/models/t-shirt/t-shirt.json' }
        if ('load_id' in this.$route.query)
            payload['load_id'] = this.$route.query['load_id']
        this.$store.dispatch('initialize', payload)
        window.addEventListener('resize', this.on_resize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.on_resize)
    }
}