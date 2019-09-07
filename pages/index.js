import Renderer from 'static/renderer/renderer.js'
import { mapState } from 'vuex';

export default {
    name: 'App',
    data () {
        return {
            renderer: null,
        }
    },
    methods: {
        route_matches(path) {
            return this.$route.matched.some(({ regex }) => regex.test(path))
        }
    },
    computed: mapState({
        colors: (state) => state.colors
    }),
    mounted () {
        if (!this.$store.state.initialized) {
            this.renderer = new Renderer(this.$refs.rendererContainer)
            this.$store.dispatch('initialize', { renderer: this.renderer, model_url: '/t-shirt/t-shirt.json' })
        }
        else
            console.log('keeping renderer')
  },
}