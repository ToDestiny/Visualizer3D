import Renderer from 'static/renderer/renderer.js'
import axios from 'axios'
import { mapState } from 'vuex';
import { cid } from '../static/uuid'
import { link_file } from '../static/upload'

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
        window.addEventListener('resize', this.on_resize)
        // Renderer and model setup
        this.renderer = new Renderer(this.$refs.rendererContainer)
        let payload = { renderer: this.renderer, model_url: '/models/t-shirt/t-shirt.json' }
        if ('load_id' in this.$route.query)
            payload['load_id'] = this.$route.query['load_id']
        this.$store.dispatch('initialize', payload)
        // cid setup
        let q_cid
        if ('cid' in this.$route.query)
            this.$store.dispatch('set_cid', this.$route.query['cid'])
        else
            this.$store.dispatch('set_cid', cid())
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.on_resize)
    }
}