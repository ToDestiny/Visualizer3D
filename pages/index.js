
import ImageLoad from '../components/image_load.vue'
import TemplateSelect from '../components/template_select.vue'
import Renderer from '../components/renderer/renderer.js'
import { mapState } from 'vuex';

export default {
    name: 'App',
    components: {
        ImageLoad,
        TemplateSelect
    },
    data () {
        return {
            renderer: null,
        }
    },
    methods: {},
    computed: {
        active_panel: {
            get() { return this.$store.state.active_panel },
            set(value) {
                this.$store.commit('select_panel', value)
            }
        }
    },
    mounted () {
        if (!this.$store.state.initialized) {
            this.renderer = new Renderer(this.$refs.rendererContainer)
            this.$store.dispatch('initialize', { renderer: this.renderer, model_url: 't-shirt/t-shirt.json' })
        }
        else
            console.log('keeping renderer')
  },
}