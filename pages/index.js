
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
    methods: {
        selectTab(value) {
            // TODO turn into radio buttons?
            this.$store.dispatch('select_panel', value)
        }
    },
    computed: mapState({
        active_panel: 'active_panel'
    }),
    mounted () {
        if (!this.$store.state.initialized) {
            this.renderer = new Renderer(this.$refs.rendererContainer)
            this.$store.dispatch('initialize', { renderer: this.renderer, model_url: 't-shirt/t-shirt.json' })
        }
        else
            console.log('keeping renderer')
  },
}