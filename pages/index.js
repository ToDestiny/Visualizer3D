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
        this.$store.dispatch('initialize', { renderer: this.renderer, model_url: '/models/t-shirt/t-shirt.json' })
        axios.post("https://dev-api.myth.gg/api/auth/login", {
            email: "alexamadori592@gmail.com",
            password: "jamashinaide"
        })
        .then((response) => {
            console.log(response)
            return this.$store.dispatch("set_user_token", response.data.user.token)
        })
        .catch((error) => console.error(error))
        window.addEventListener('resize', this.on_resize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.on_resize)
    }
}